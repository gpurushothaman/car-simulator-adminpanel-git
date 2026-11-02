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
import { getSpoilers, createSpoiler, deleteSpoiler, updateSpoiler } from '../../services/spoilerService';

export default function Spoilers() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');

  const [spoilerForm, setSpoilerForm] = useState({
    spoilerThumbnail: null,
    spoilerThumbnailPath: null,
    spoilerThumbnailFileName: null,
    spoilerModel: null,
    spoilerModelPath: null,
    spoilerModelFileName: null,
    spoilerName: null,
    cost: null,
    description: null,
    previewSpoilerThumbnail: null,
    status: 'inactive',
    spoilerId: null
  });
  const [open, setOpen] = useState(false);
  const [spoilerList, setSpoilerList] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [spoilerData, setSpoilerData] = useState(null);

  useEffect(() => {
    getAllSpoilers();
  }, []);

  const getAllSpoilers = async () => {
    try {
      const response = await getSpoilers();
      if (response?.data?.success) {
        setSpoilerList(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uploadSpoilerfn = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSpoilerForm({
      ...spoilerForm,
      spoilerThumbnail: e.target.files[0],
      spoilerThumbnailFileName: e.target.files[0]?.name,
      previewspoilerThumbnail: URL.createObjectURL(file)
    });
  };

  const saveSpoiler = async (spoilerID, updatedSpoiler) => {
    try {
      const response = await updateSpoiler(spoilerID, updatedSpoiler);

      if (response?.data?.success) {
        showToast('Spoiler updated successfully', 'success');
      } else {
        showToast('Spoiler not updated', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const handleUpdateSpoiler = async (spoilerID, value, control) => {
    const spoiler = spoilerList.filter((spoiler) => spoiler._id === spoilerID)?.[0];

    if (!spoiler) return;

    const updatedSpoiler = {
      ...spoiler,
      [control]: value
    };
    setSpoilerList((prev) => prev.map((spoiler) => (spoiler._id === spoilerID ? updatedSpoiler : spoiler)));

    if (control === 'status') {
      saveSpoiler(spoilerID, updatedSpoiler);
    }
  };

  const handleEditSpoiler = (id, flag) => {
    setEditStatus(true);
    setSpoilerList(spoilerList.map((spoiler) => (spoiler._id === id ? { ...spoiler, editing: !spoiler?.editing } : spoiler)));

    const result = spoilerList.filter((spoiler) => spoiler._id === id)?.[0];
    setOpen(true);

    setSpoilerForm({
      ...spoilerForm,
      spoilerThumbnail: null,
      spoilerThumbnailPath: result?.thumbnailPath,
      spoilerThumbnailFileName: result?.thumbnailFileName,
     spoilerName: result?.spoilerName,
      previewSpoilerThumbnail: `${SERVER_URL}/${result?.thumbnailPath}`,
      status: result?.status ? 'active' : 'inactive',
      spoilerId: result?._id,
      spoilerModel: null,
      spoilerModelPath: result?.modelPath,
      spoilerModelFileName: result?.modelFileName,
      cost: result?.cost,
      description: result?.description
    });
  };

  const handleCreateSpoiler = async () => {
    if (spoilerForm?.spoilerThumbnailFileName && spoilerForm?.spoilerName && spoilerForm?.spoilerModelFileName) {
      try {
        const formData = new FormData();
        if (spoilerForm?.spoilerThumbnail) {
          formData.append('spoilerThumbnail', spoilerForm?.spoilerThumbnail);
        }

        if (spoilerForm?.spoilerModel) {
          formData.append('spoilerModel', spoilerForm?.spoilerModel);
        }
        formData.append('spoilerName', spoilerForm?.spoilerName);
        formData.append('description', spoilerForm?.description);
        formData.append('cost', spoilerForm?.cost);
        formData.append('status', spoilerForm?.status === 'active' ? true : false);
        if (editStatus) {
          formData.append('spoilerId', spoilerForm?.spoilerId);
        }

        const response = await createSpoiler(formData);
        if (response?.data?.success) {
          setSpoilerForm({
            ...spoilerForm,
            spoilerThumbnail: null,
            spoilerThumbnailPath: null,
            spoilerThumbnailFileName: null,
            spoilerName: null,
            previewSpoilerThumbnail: null,
            spoilerModel: null,
            spoilerModelPath: null,
            spoilerModelFileName: null,
            cost: null,
            description: null
          });

          setSpoilerList((prev) => {
            const index = prev.findIndex((item) => item._id === response.data.data._id);

            if (index !== -1) {
              // update spoiler
              const updated = [...prev];
              updated[index] = response.data.data;
              return updated;
            }

            // Create spoiler
            return [...prev, response.data.data];
          });
          setOpen(false);

          showToast('Spoiler created successfully', 'success');
        } else {
          showToast('Spoiler not created', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    } else {
      showToast('Please fill all values in the form', 'error');
    }
  };

  const handleDeleteSpoiler = (spoilerID) => {
    const filtered = spoilerList.filter((spoiler) => spoiler._id === spoilerID)?.[0];
    console.log(filtered);
    setSpoilerData(filtered);
    setDeleteOpen(true);
  };

  const spoilerConformDelete = async () => {
    try {
      const { data } = await deleteSpoiler(spoilerData?._id);
      if (data.success) {
        setSpoilerList(spoilerList.filter((spoiler) => spoiler._id !== spoilerData?._id));

        showToast('Spoiler deleted successfully', 'success');
        setDeleteOpen(false);
      } else {
        showToast('Spoiler not delete', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const uploadModelfn = (e) => {
    setSpoilerForm({
      ...spoilerForm,
      spoilerModel: e.target.files[0],
      spoilerModelFileName: e.target.files[0]?.name
    });
    e.target.value = '';
  };

  const addSpoilerfn = (e) => {
    setSpoilerForm({
      ...spoilerForm,
      spoilerThumbnail: null,
      spoilerThumbnailPath: null,
      spoilerThumbnailFileName: null,
      spoilerModel: null,
      spoilerModelPath: null,
      spoilerModelFileName: null,
      spoilerName: null,
      cost: null,
      description: null,
      previewSpoilerThumbnail: null,
      status: 'inactive',
      spoilerId: null
    });
    setOpen(true);
    setEditStatus(false);
  };

  const filteredSpoiler = spoilerList.filter((spoiler) => {
    const matchesSearch = !searchTerm || spoiler._id === searchTerm;

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
      <h1>Spoiler - Management</h1>

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
          onClick={() => addSpoilerfn()}
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
          {filteredSpoiler.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: 'center',
                  padding: '20px'
                }}
              >
                No Spoiler Found
              </td>
            </tr>
          ) : (
            filteredSpoiler.map((spoilers, index) => (
              <tr key={spoilers._id}>
                <td style={tdStyle}>
                  <Avatar src={`${SERVER_URL}/${spoilers.thumbnailPath}`} alt={spoilers.spoilerName} sx={{ width: 40, height: 40 }} />
                </td>

                <td style={tdStyle}>
                  <Typography fontWeight={600}>{spoilers.spoilerName}</Typography>
                </td>

                <td style={tdStyle}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={spoilers?.status}
                        onChange={(e) => handleUpdateSpoiler(spoilers._id, e.target.checked, 'status')}
                        color="success"
                      />
                    }
                    label={spoilers?.status ? 'Active' : 'Inactive'}
                  />
                </td>

                <td style={tdStyle}>
                  <Tooltip title={'Edit'}>
                    <IconButton color={'success'} onClick={() => handleEditSpoiler(spoilers._id, spoilers.editing)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteSpoiler(spoilers._id)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*Spoiler - upload dialog*/}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Spoiler - Details</DialogTitle>

        <DialogContent>
          <Card elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Name
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Spoiler Name"
                    value={spoilerForm?.spoilerName || ''}
                    fullWidth
                    onChange={(e) => {
                      setSpoilerForm({
                        ...spoilerForm,
                        spoilerName: e.target.value
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
                    value={spoilerForm?.description || ''}
                    fullWidth
                    multiline
                    minRows={3}
                    onChange={(e) => {
                      setSpoilerForm({
                        ...spoilerForm,
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
                    value={spoilerForm?.cost || ''}
                    fullWidth
                    onChange={(e) => {
                      setSpoilerForm({
                        ...spoilerForm,
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
                      value={spoilerForm?.status}
                      onChange={(e) => {
                        setSpoilerForm({
                          ...spoilerForm,
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
                    Upload Spoiler Model (.glb)
                    <input hidden type="file" accept=".glb" onChange={uploadModelfn} />
                  </Button>

                  <Typography variant="body2" color="text.secondary">
                    {spoilerForm?.spoilerModelFileName || 'No model selected'}
                  </Typography>
                </Stack>
              </Grid>

              {/* Spoiler thumbnail image Upload */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={2}>
                  <Button variant="contained" component="label" startIcon={<ImageIcon />}>
                    Upload Spoiler Thumbnail Image
                    <input hidden type="file" accept="image/*" onChange={uploadSpoilerfn} />
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
                      {spoilerForm?.spoilerThumbnailFileName || 'No thumbnail image selected'}
                    </Typography>
                  </Stack>
                  {spoilerForm?.previewSpoilerThumbnail && (
                    <Box
                      component="img"
                      src={spoilerForm?.previewSpoilerThumbnail}
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

          <Button variant="contained" onClick={() => handleCreateSpoiler()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Spoiler</DialogTitle>

        <DialogContent>
          <DialogContentText>Are you sure you want to delete this spoiler?</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={() => spoilerConformDelete()}>
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
