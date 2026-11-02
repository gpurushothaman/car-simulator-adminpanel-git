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
import { getFrontBumpers, createFrontBumper, deleteFrontBumper, updateFrontBumper } from '../../services/frontBumperService';

export default function FrontBumpers() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');

  const [frontbumperForm, setFrontBumperForm] = useState({
    frontbumperThumbnail: null,
    frontbumperThumbnailPath: null,
    frontbumperThumbnailFileName: null,
    frontbumperModel: null,
    frontbumperModelPath: null,
    frontbumperModelFileName: null,
    frontbumperName: null,
    cost: null,
    description: null,
    previewFrontBumperThumbnail: null,
    status: 'inactive',
    frontbumperId: null
  });
  const [open, setOpen] = useState(false);
  const [frontbumperList, setFrontBumperList] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [frontbumperData, setFrontBumperData] = useState(null);

  useEffect(() => {
    getAllFrontBumpers();
  }, []);

  const getAllFrontBumpers = async () => {
    try {
      const response = await getFrontBumpers();
      if (response?.data?.success) {
        setFrontBumperList(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFrontBumperfn = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFrontBumperForm({
      ...frontbumperForm,
      frontbumperThumbnail: e.target.files[0],
      frontbumperThumbnailFileName: e.target.files[0]?.name,
      previewFrontBumperThumbnail: URL.createObjectURL(file)
    });
  };

  const saveFrontBumper = async (frontbumperID, updatedFrontBumper) => {
    try {
      const response = await updateFrontBumper(frontbumperID, updatedFrontBumper);

      if (response?.data?.success) {
        showToast('FrontBumper updated successfully', 'success');
      } else {
        showToast('FrontBumper not updated', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const handleUpdateFrontBumper = async (frontbumperID, value, control) => {
    const frontbumper = frontbumperList.filter((frontbumper) => frontbumper._id === frontbumperID)?.[0];

    if (!frontbumper) return;

    const updatedFrontBumper = {
      ...frontbumper,
      [control]: value
    };
    setFrontBumperList((prev) => prev.map((frontbumper) => (frontbumper._id === frontbumperID ? updatedFrontBumper : frontbumper)));

    if (control === 'status') {
      saveFrontBumper(frontbumperID, updatedFrontBumper);
    }
  };

  const handleEditFrontBumper = (id, flag) => {
    setEditStatus(true);
    setFrontBumperList(frontbumperList.map((frontbumper) => (frontbumper._id === id ? { ...frontbumper, editing: !frontbumper?.editing } : frontbumper)));

    const result = frontbumperList.filter((frontbumper) => frontbumper._id === id)?.[0];
    setOpen(true);

    setFrontBumperForm({
      ...frontbumperForm,
      frontbumperThumbnail: null,
      frontbumperThumbnailPath: result?.thumbnailPath,
      frontbumperThumbnailFileName: result?.thumbnailFileName,
      frontbumperName: result?.frontbumperName,
      previewFrontBumperThumbnail: `${SERVER_URL}/${result?.thumbnailPath}`,
      status: result?.status ? 'active' : 'inactive',
      frontbumperId: result?._id,
      frontbumperModel: null,
      frontbumperModelPath: result?.modelPath,
      frontbumperModelFileName: result?.modelFileName,
      cost: result?.cost,
      description: result?.description
    });
  };

  const handleCreateFrontBumper = async () => {
    if (frontbumperForm?.frontbumperThumbnailFileName && frontbumperForm?.frontbumperName && frontbumperForm?.frontbumperModelFileName) {
      try {
        const formData = new FormData();
        if (frontbumperForm?.frontbumperThumbnail) {
          formData.append('frontbumperThumbnail', frontbumperForm?.frontbumperThumbnail);
        }

        if (frontbumperForm?.frontbumperModel) {
          formData.append('frontbumperModel', frontbumperForm?.frontbumperModel);
        }
        formData.append('frontbumperName', frontbumperForm?.frontbumperName);
        formData.append('description', frontbumperForm?.description);
        formData.append('cost', frontbumperForm?.cost);
        formData.append('status', frontbumperForm?.status === 'active' ? true : false);
        if (editStatus) {
          formData.append('frontbumperId', frontbumperForm?.frontbumperId);
        }

        const response = await createFrontBumper(formData);
        if (response?.data?.success) {
          setFrontBumperForm({
            ...frontbumperForm,
            frontbumperThumbnail: null,
            frontbumperThumbnailPath: null,
            frontbumperThumbnailFileName: null,
            frontbumperName: null,
            previewFrontBumperThumbnail: null,
            frontbumperModel: null,
            frontbumperModelPath: null,
            frontbumperModelFileName: null,
            cost: null,
            description: null
          });

          setFrontBumperList((prev) => {
            const index = prev.findIndex((item) => item._id === response.data.data._id);

            if (index !== -1) {
              // update frontbumper
              const updated = [...prev];
              updated[index] = response.data.data;
              return updated;
            }

            // Create frontbumper
            return [...prev, response.data.data];
          });
          setOpen(false);

          showToast('FrontBumper created successfully', 'success');
        } else {
          showToast('FrontBumper not created', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    } else {
      showToast('Please fill all values in the form', 'error');
    }
  };

  const handleDeleteFrontBumper = (frontbumperID) => {
    const filtered = frontbumperList.filter((frontbumper) => frontbumper._id === frontbumperID)?.[0];
    console.log(filtered);
    setFrontBumperData(filtered);
    setDeleteOpen(true);
  };

  const frontbumperConformDelete = async () => {
    try {
      const { data } = await deleteFrontBumper(frontbumperData?._id);
      if (data.success) {
        setFrontBumperList(frontbumperList.filter((frontbumper) => frontbumper._id !== frontbumperData?._id));

        showToast('FrontBumper deleted successfully', 'success');
        setDeleteOpen(false);
      } else {
        showToast('FrontBumper not delete', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const uploadModelfn = (e) => {
    setFrontBumperForm({
      ...frontbumperForm,
      frontbumperModel: e.target.files[0],
      frontbumperModelFileName: e.target.files[0]?.name
    });
    e.target.value = '';
  };

  const addFrontBumperfn = (e) => {
    setFrontBumperForm({
      ...frontbumperForm,
      frontbumperThumbnail: null,
      frontbumperThumbnailPath: null,
      frontbumperThumbnailFileName: null,
      frontbumperModel: null,
      frontbumperModelPath: null,
      frontbumperModelFileName: null,
      frontbumperName: null,
      cost: null,
      description: null,
      previewFrontBumperThumbnail: null,
      status: 'inactive',
      frontbumperId: null
    });
    setOpen(true);
    setEditStatus(false);
  };

  const filteredFrontBumper = frontbumperList.filter((frontbumper) => {
    const matchesSearch = !searchTerm || frontbumper._id === searchTerm;

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
      <h1>FrontBumper - Management</h1>

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
          onClick={() => addFrontBumperfn()}
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
          {filteredFrontBumper.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: 'center',
                  padding: '20px'
                }}
              >
                No FrontBumper Found
              </td>
            </tr>
          ) : (
            filteredFrontBumper.map((frontbumpers, index) => (
              <tr key={frontbumpers._id}>
                <td style={tdStyle}>
                  <Avatar src={`${SERVER_URL}/${frontbumpers.thumbnailPath}`} alt={frontbumpers.frontbumperName} sx={{ width: 40, height: 40 }} />
                </td>

                <td style={tdStyle}>
                  <Typography fontWeight={600}>{frontbumpers.frontbumperName}</Typography>
                </td>

                <td style={tdStyle}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={frontbumpers?.status}
                        onChange={(e) => handleUpdateFrontBumper(frontbumpers._id, e.target.checked, 'status')}
                        color="success"
                      />
                    }
                    label={frontbumpers?.status ? 'Active' : 'Inactive'}
                  />
                </td>

                <td style={tdStyle}>
                  <Tooltip title={'Edit'}>
                    <IconButton color={'success'} onClick={() => handleEditFrontBumper(frontbumpers._id, frontbumpers.editing)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteFrontBumper(frontbumpers._id)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*FrontBumper - upload dialog*/}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>FrontBumper - Details</DialogTitle>

        <DialogContent>
          <Card elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Name
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="FrontBumper Name"
                    value={frontbumperForm?.frontbumperName || ''}
                    fullWidth
                    onChange={(e) => {
                      setFrontBumperForm({
                        ...frontbumperForm,
                        frontbumperName: e.target.value
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
                    value={frontbumperForm?.description || ''}
                    fullWidth
                    multiline
                    minRows={3}
                    onChange={(e) => {
                      setFrontBumperForm({
                        ...frontbumperForm,
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
                    value={frontbumperForm?.cost || ''}
                    fullWidth
                    onChange={(e) => {
                      setFrontBumperForm({
                        ...frontbumperForm,
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
                      value={frontbumperForm?.status}
                      onChange={(e) => {
                        setFrontBumperForm({
                          ...frontbumperForm,
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
                    Upload FrontBumper Model (.glb)
                    <input hidden type="file" accept=".glb" onChange={uploadModelfn} />
                  </Button>

                  <Typography variant="body2" color="text.secondary">
                    {frontbumperForm?.frontbumperModelFileName || 'No model selected'}
                  </Typography>
                </Stack>
              </Grid>

              {/* FrontBumper thumbnail image Upload */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={2}>
                  <Button variant="contained" component="label" startIcon={<ImageIcon />}>
                    Upload FrontBumper Thumbnail Image
                    <input hidden type="file" accept="image/*" onChange={uploadFrontBumperfn} />
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
                      {frontbumperForm?.frontbumperThumbnailFileName || 'No thumbnail image selected'}
                    </Typography>
                  </Stack>
                  {frontbumperForm?.previewFrontBumperThumbnail && (
                    <Box
                      component="img"
                      src={frontbumperForm?.previewFrontBumperThumbnail}
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

          <Button variant="contained" onClick={() => handleCreateFrontBumper()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete FrontBumper</DialogTitle>

        <DialogContent>
          <DialogContentText>Are you sure you want to delete this frontbumper?</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={() => frontbumperConformDelete()}>
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
