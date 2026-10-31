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
import { getSteerings, createSteering, deleteSteering, updateSteering } from '../../services/steeringService';

export default function Steering() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');

  const [steeringForm, setSteeringForm] = useState({
    steeringThumbnail: null,
    steeringThumbnailPath: null,
    steeringThumbnailFileName: null,
    steeringModel: null,
    steeringModelPath: null,
    steeringModelFileName: null,
    steeringName: null,
    cost: null,
    description: null,
    previewSteeringThumbnail: null,
    status: 'inactive',
    steeringId: null
  });
  const [open, setOpen] = useState(false);
  const [steeringList, setSteeringList] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [steeringData, setSteeringData] = useState(null);

  useEffect(() => {
    getAllSteerings();
  }, []);

  const getAllSteerings = async () => {
    try {
      const response = await getSteerings();
      if (response?.data?.success) {
        setSteeringList(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uploadSteeringfn = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSteeringForm({
      ...steeringForm,
      steeringThumbnail: e.target.files[0],
      steeringThumbnailFileName: e.target.files[0]?.name,
      previewSteeringThumbnail: URL.createObjectURL(file)
    });
  };

  const saveSteering = async (steeringID, updatedSteering) => {
    try {
      const response = await updateSteering(steeringID, updatedSteering);

      if (response?.data?.success) {
        showToast('Steering updated successfully', 'success');
      } else {
        showToast('Steering not updated', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const handleUpdateSteering = async (steeringID, value, control) => {
    const steering = steeringList.filter((steering) => steering._id === steeringID)?.[0];

    if (!steering) return;

    const updatedSteering = {
      ...steering,
      [control]: value
    };
    setSteeringList((prev) => prev.map((steering) => (steering._id === steeringID ? updatedSteering : steering)));

    if (control === 'status') {
      saveSteering(steeringID, updatedSteering);
    }
  };

  const handleEditSteering = (id, flag) => {
    setEditStatus(true);
    setSteeringList(steeringList.map((steering) => (steering._id === id ? { ...steering, editing: !steering?.editing } : steering)));

    const result = steeringList.filter((steering) => steering._id === id)?.[0];
    setOpen(true);

    setSteeringForm({
      ...steeringForm,
      steeringThumbnail: null,
      steeringThumbnailPath: result?.thumbnailPath,
      steeringThumbnailFileName: result?.thumbnailFileName,
      steeringName: result?.steeringName,
      previewSteeringThumbnail: `${SERVER_URL}/${result?.thumbnailPath}`,
      status: result?.status ? 'active' : 'inactive',
      steeringId: result?._id,
      steeringModel: null,
      steeringModelPath: result?.modelPath,
      steeringModelFileName: result?.modelFileName,
      cost: result?.cost,
      description: result?.description
    });
  };

  const handleCreateSteering = async () => {
    if (steeringForm?.steeringThumbnailFileName && steeringForm?.steeringName && steeringForm?.steeringModelFileName) {
      try {
        const formData = new FormData();
        if (steeringForm?.steeringThumbnail) {
          formData.append('steeringThumbnail', steeringForm?.steeringThumbnail);
        }

        if (steeringForm?.steeringModel) {
          formData.append('steeringModel', steeringForm?.steeringModel);
        }
        formData.append('steeringName', steeringForm?.steeringName);
        formData.append('description', steeringForm?.description);
        formData.append('cost', steeringForm?.cost);
        formData.append('status', steeringForm?.status === 'active' ? true : false);
        if (editStatus) {
          formData.append('steeringId', steeringForm?.steeringId);
        }

        const response = await createSteering(formData);
        if (response?.data?.success) {
          setSteeringForm({
            ...steeringForm,
            steeringThumbnail: null,
            steeringThumbnailPath: null,
            steeringThumbnailFileName: null,
            steeringName: null,
            previewSteeringThumbnail: null,
            steeringModel: null,
            steeringModelPath: null,
            steeringModelFileName: null,
            cost: null,
            description: null
          });

          setSteeringList((prev) => {
            const index = prev.findIndex((item) => item._id === response.data.data._id);

            if (index !== -1) {
              // update steering
              const updated = [...prev];
              updated[index] = response.data.data;
              return updated;
            }

            // Create steering
            return [...prev, response.data.data];
          });
          setOpen(false);

          showToast('Steering created successfully', 'success');
        } else {
          showToast('Steering not created', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    } else {
      showToast('Please fill all values in the form', 'error');
    }
  };

  const handleDeleteSteering = (steeringID) => {
    const filtered = steeringList.filter((steering) => steering._id === steeringID)?.[0];
    console.log(filtered);
    setSteeringData(filtered);
    setDeleteOpen(true);
  };

  const steeringConformDelete = async () => {
    try {
      const { data } = await deleteSteering(steeringData?._id);
      if (data.success) {
        setSteeringList(steeringList.filter((steering) => steering._id !== steeringData?._id));

        showToast('Steering deleted successfully', 'success');
        setDeleteOpen(false);
      } else {
        showToast('Steering not delete', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const uploadModelfn = (e) => {
    setSteeringForm({
      ...steeringForm,
      steeringModel: e.target.files[0],
      steeringModelFileName: e.target.files[0]?.name
    });
    e.target.value = '';
  };

  const addSteeringfn = (e) => {
    setSteeringForm({
      ...steeringForm,
      steeringThumbnail: null,
      steeringThumbnailPath: null,
      steeringThumbnailFileName: null,
      steeringModel: null,
      steeringModelPath: null,
      steeringModelFileName: null,
      steeringName: null,
      cost: null,
      description: null,
      previewSteeringThumbnail: null,
      status: 'inactive',
      steeringId: null
    });
    setOpen(true);
    setEditStatus(false);
  };

  const filteredSteerings = steeringList.filter((steering) => {
    const matchesSearch = !searchTerm || steering._id === searchTerm;

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
      <h1>Steering - Management</h1>

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
          onClick={() => addSteeringfn()}
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
          {filteredSteerings.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: 'center',
                  padding: '20px'
                }}
              >
                No Steerings Found
              </td>
            </tr>
          ) : (
            filteredSteerings.map((steerings, index) => (
              <tr key={steerings._id}>
                <td style={tdStyle}>
                  <Avatar src={`${SERVER_URL}/${steerings.thumbnailPath}`} alt={steerings.steeringName} sx={{ width: 40, height: 40 }} />
                </td>

                <td style={tdStyle}>
                  <Typography fontWeight={600}>{steerings.steeringName}</Typography>
                </td>

                <td style={tdStyle}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={steerings?.status}
                        onChange={(e) => handleUpdateSteering(steerings._id, e.target.checked, 'status')}
                        color="success"
                      />
                    }
                    label={steerings?.status ? 'Active' : 'Inactive'}
                  />
                </td>

                <td style={tdStyle}>
                  <Tooltip title={'Edit'}>
                    <IconButton color={'success'} onClick={() => handleEditSteering(steerings._id, steerings.editing)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteSteering(steerings._id)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*steering - upload dialog*/}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Steering - Details</DialogTitle>

        <DialogContent>
          <Card elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Name
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Steering Name"
                    value={steeringForm?.steeringName || ''}
                    fullWidth
                    onChange={(e) => {
                      setSteeringForm({
                        ...steeringForm,
                        steeringName: e.target.value
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
                    value={steeringForm?.description || ''}
                    fullWidth
                    multiline
                    minRows={3}
                    onChange={(e) => {
                      setSteeringForm({
                        ...steeringForm,
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
                    value={steeringForm?.cost || ''}
                    fullWidth
                    onChange={(e) => {
                      setSteeringForm({
                        ...steeringForm,
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
                      value={steeringForm?.status}
                      onChange={(e) => {
                        setSteeringForm({
                          ...steeringForm,
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
                    Upload Steering Model (.glb)
                    <input hidden type="file" accept=".glb" onChange={uploadModelfn} />
                  </Button>

                  <Typography variant="body2" color="text.secondary">
                    {steeringForm?.steeringModelFileName || 'No model selected'}
                  </Typography>
                </Stack>
              </Grid>

              {/* Steering thumbnail image Upload */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={2}>
                  <Button variant="contained" component="label" startIcon={<ImageIcon />}>
                    Upload Steering Thumbnail Image
                    <input hidden type="file" accept="image/*" onChange={uploadSteeringfn} />
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
                      {steeringForm?.steeringThumbnailFileName || 'No thumbnail image selected'}
                    </Typography>
                  </Stack>
                  {steeringForm?.previewSteeringThumbnail && (
                    <Box
                      component="img"
                      src={steeringForm?.previewSteeringThumbnail}
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

          <Button variant="contained" onClick={() => handleCreateSteering()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Steering</DialogTitle>

        <DialogContent>
          <DialogContentText>Are you sure you want to delete this steering?</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={() => steeringConformDelete()}>
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
