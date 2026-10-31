import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  Switch,
  FormControlLabel,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  Box,
  Typography,
  Tooltip,
  TextField,
  Avatar,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageIcon from '@mui/icons-material/Image';

import DeleteOutlineIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
//Toast
import { useToast } from '../../contexts/ToastContext';
//api
import { getTyres, createTyre, deleteTyre, updateTyre } from '../../services/tyreService';

export default function Tyres() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');

  const [tyreForm, setTyreForm] = useState({
    tyreThumbnail: null,
    tyreThumbnailPath: null,
    tyreThumbnailFileName: null,
    tyreModel: null,
    tyreModelPath: null,
    tyreModelFileName: null,
    tyreName: null,
    cost: null,
    description: null,
    previewTyreThumbnail: null,
    status: 'inactive',
    tyreId: null
  });
  const [open, setOpen] = useState(false);
  const [tyreList, setTyreList] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [tyreData, setTyreData] = useState(null);

  useEffect(() => {
    getAllTyres();
  }, []);

  const getAllTyres = async () => {
    try {
      const response = await getTyres();
      if (response?.data?.success) {
        setTyreList(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uploadTyrefn = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setTyreForm({
      ...tyreForm,
      tyreThumbnail: e.target.files[0],
      tyreThumbnailFileName: e.target.files[0]?.name,
      previewTyreThumbnail: URL.createObjectURL(file)
    });
  };

  const saveTyre = async (tyreID, updatedTyre) => {
    try {
      const response = await updateTyre(tyreID, updatedTyre);

      if (response?.data?.success) {
        showToast('Tyre updated successfully', 'success');
      } else {
        showToast('Tyre not updated', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const handleUpdateTyre = async (tyreID, value, control) => {
    const tyre = tyreList.filter((tyre) => tyre._id === tyreID)?.[0];

    if (!tyre) return;

    const updatedTyre = {
      ...tyre,
      [control]: value
    };
    setTyreList((prev) => prev.map((tyre) => (tyre._id === tyreID ? updatedTyre : tyre)));

    if (control === 'status') {
      saveTyre(tyreID, updatedTyre);
    }
  };

  const handleEditTyre = (id, flag) => {
    setEditStatus(true);
    setTyreList(tyreList.map((tyre) => (tyre._id === id ? { ...tyre, editing: !tyre?.editing } : tyre)));

    const result = tyreList.filter((tyre) => tyre._id === id)?.[0];
    setOpen(true);

    setTyreForm({
      ...tyreForm,
      tyreThumbnail: null,
      tyreThumbnailPath: result?.thumbnailPath,
      tyreThumbnailFileName: result?.thumbnailFileName,
      tyreName: result?.tyreName,
      previewTyreThumbnail: `${SERVER_URL}/${result?.thumbnailPath}`,
      status: result?.status ? 'active' : 'inactive',
      tyreId: result?._id,
      tyreModel: null,
      tyreModelPath: result?.modelPath,
      tyreModelFileName: result?.modelFileName,
      cost: result?.cost,
      description: result?.description
    });
  };

  const handleCreateTyre = async () => {
    if (tyreForm?.tyreThumbnailFileName && tyreForm?.tyreName && tyreForm?.tyreModelFileName) {
      try {
        const formData = new FormData();
        if (tyreForm?.tyreThumbnail) {
          formData.append('tyreThumbnail', tyreForm?.tyreThumbnail);
        }

        if (tyreForm?.tyreModel) {
          formData.append('tyreModel', tyreForm?.tyreModel);
        }
        formData.append('tyreName', tyreForm?.tyreName);
        formData.append('description', tyreForm?.description);
        formData.append('cost', tyreForm?.cost);
        formData.append('status', tyreForm?.status === 'active' ? true : false);
        if (editStatus) {
          formData.append('tyreId', tyreForm?.tyreId);
        }

        const response = await createTyre(formData);
        if (response?.data?.success) {
          setTyreForm({
            ...tyreForm,
            tyreThumbnail: null,
            tyreThumbnailPath: null,
            tyreThumbnailFileName: null,
            tyreName: null,
            previewTyreThumbnail: null,
            tyreModel: null,
            tyreModelPath: null,
            tyreModelFileName: null,
            cost: null,
            description: null
          });

          setTyreList((prev) => {
            const index = prev.findIndex((item) => item._id === response.data.data._id);

            if (index !== -1) {
              // update tyre
              const updated = [...prev];
              updated[index] = response.data.data;
              return updated;
            }

            // Create tyre
            return [...prev, response.data.data];
          });
          setOpen(false);

          showToast('Tyre created successfully', 'success');
        } else {
          showToast('Tyre not created', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    } else {
      showToast('Please fill all values in the form', 'error');
    }
  };

  const handleDeleteTyre = (tyreID) => {
    const filtered = tyreList.filter((tyre) => tyre._id === tyreID)?.[0];
    console.log(filtered);
    setTyreData(filtered);
    setDeleteOpen(true);
  };

  const tyreConformDelete = async () => {
    try {
      const { data } = await deleteTyre(tyreData?._id);
      if (data.success) {
        setTyreList(tyreList.filter((tyre) => tyre._id !== tyreData?._id));

        showToast('Tyre deleted successfully', 'success');
        setDeleteOpen(false);
      } else {
        showToast('Tyre not delete', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const uploadModelfn = (e) => {
    setTyreForm({
      ...tyreForm,
      tyreModel: e.target.files[0],
      tyreModelFileName: e.target.files[0]?.name
    });
    e.target.value = '';
  };

  const addTyrefn = (e) => {
    setTyreForm({
      ...tyreForm,
      tyreThumbnail: null,
      tyreThumbnailPath: null,
      tyreThumbnailFileName: null,
      tyreModel: null,
      tyreModelPath: null,
      tyreModelFileName: null,
      tyreName: null,
      cost: null,
      description: null,
      previewTyreThumbnail: null,
      status: 'inactive',
      tyreId: null
    });
    setOpen(true);
    setEditStatus(false);
  };

  const filteredTyres = tyreList.filter((tyre) => {
    const matchesSearch = !searchTerm || tyre._id === searchTerm;

    return matchesSearch;
  });

  return (
    <div
      style={{
        padding: '20px',
        background: '#fff',
        borderRadius: '10px'
      }}
    >
      <h1>Tyre - Management</h1>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          p: 2,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb'
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => addTyrefn()}
          sx={{
            px: 3,
            py: 1,
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 6px 18px rgba(25,118,210,0.25)'
            }
          }}
        >
          Add Item
        </Button>
      </Box>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}
      >
        <thead>
          <tr
            style={{
              background: '#ccfb96'
            }}
          >
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredTyres.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: 'center',
                  padding: '20px'
                }}
              >
                No Tyres Found
              </td>
            </tr>
          ) : (
            filteredTyres.map((tyres, index) => (
              <tr key={tyres._id}>
                <td style={tdStyle}>
                  <Avatar src={`${SERVER_URL}/${tyres.thumbnailPath}`} alt={tyres.tyreName} sx={{ width: 40, height: 40 }} />
                </td>

                <td style={tdStyle}>
                  <Typography fontWeight={600}>{tyres.tyreName}</Typography>
                </td>

                <td style={tdStyle}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tyres?.status}
                        onChange={(e) => handleUpdateTyre(tyres._id, e.target.checked, 'status')}
                        color="success"
                      />
                    }
                    label={tyres?.status ? 'Active' : 'Inactive'}
                  />
                </td>

                <td style={tdStyle}>
                  <Tooltip title={'Edit'}>
                    <IconButton color={'success'} onClick={() => handleEditTyre(tyres._id, tyres.editing)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteTyre(tyres._id)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*Tyre - upload dialog*/}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tyre - Details</DialogTitle>

        <DialogContent>
          <Card elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Name
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Tyre Name"
                    value={tyreForm?.tyreName || ''}
                    fullWidth
                    onChange={(e) => {
                      setTyreForm({
                        ...tyreForm,
                        tyreName: e.target.value
                      });
                    }}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Type a text ..."
                    value={tyreForm?.description || ''}
                    fullWidth
                    multiline
                    minRows={3}
                    onChange={(e) => {
                      setTyreForm({
                        ...tyreForm,
                        description: e.target.value
                      });
                    }}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Cost
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="0"
                    value={tyreForm?.cost || ''}
                    fullWidth
                    onChange={(e) => {
                      setTyreForm({
                        ...tyreForm,
                        cost: e.target.value
                      });
                    }}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Status
                </Typography>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={tyreForm?.status}
                      onChange={(e) => {
                        setTyreForm({
                          ...tyreForm,
                          status: e.target.value
                        });
                      }}
                    >
                      <MenuItem value={'active'}>Active</MenuItem>
                      <MenuItem value={'inactive'}>InActive</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              {/* Model Upload */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={1}>
                  <Button variant="contained" component="label" startIcon={<UploadFileIcon />}>
                    Upload Tyre Model (.glb)
                    <input hidden type="file" accept=".glb" onChange={uploadModelfn} />
                  </Button>

                  <Typography variant="body2" color="text.secondary">
                    {tyreForm?.tyreModelFileName || 'No model selected'}
                  </Typography>
                </Stack>
              </Grid>

              {/* Tyre thumbnail image Upload */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={2}>
                  <Button variant="contained" component="label" startIcon={<ImageIcon />}>
                    Upload Tyre Thumbnail Image
                    <input hidden type="file" accept="image/*" onChange={uploadTyrefn} />
                  </Button>

                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tyreForm?.tyreThumbnailFileName || 'No thumbnail image selected'}
                    </Typography>
                  </Stack>
                  {tyreForm?.previewTyreThumbnail && (
                    <Box
                      component="img"
                      src={tyreForm?.previewTyreThumbnail}
                      alt="Thumb Preview"
                      sx={{
                        width: 250,
                        height: 250,
                        objectFit: 'cover',
                        border: '1px solid #ccc',
                        borderRadius: 2
                      }}
                    />
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={() => handleCreateTyre()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Tyre</DialogTitle>

        <DialogContent>
          <DialogContentText>Are you sure you want to delete this tyre?</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={() => tyreConformDelete()}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const thStyle = {
  border: '1px solid #ddd',
  padding: '12px'
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  textAlign: 'center'
};
