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
import { getRearBumpers, createRearBumper, deleteRearBumper, updateRearBumper } from '../../services/rearBumperService';

export default function RearBumpers() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');

  const [rearbumperForm, setRearBumperForm] = useState({
    rearbumperThumbnail: null,
    rearbumperThumbnailPath: null,
    rearbumperThumbnailFileName: null,
    rearbumperModel: null,
    rearbumperModelPath: null,
    rearbumperModelFileName: null,
    rearbumperName: null,
    cost: null,
    description: null,
    previewRearBumperThumbnail: null,
    status: 'inactive',
    rearbumperId: null
  });
  const [open, setOpen] = useState(false);
  const [rearbumperList, setRearBumperList] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [rearbumperData, setRearBumperData] = useState(null);

  useEffect(() => {
    getAllRearBumpers();
  }, []);

  const getAllRearBumpers = async () => {
    try {
      const response = await getRearBumpers();
      if (response?.data?.success) {
        setRearBumperList(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uploadRearBumperfn = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setRearBumperForm({
      ...rearbumperForm,
      rearbumperThumbnail: e.target.files[0],
      rearbumperThumbnailFileName: e.target.files[0]?.name,
      previewRearBumperThumbnail: URL.createObjectURL(file)
    });
  };

  const saveRearBumper = async (rearbumperID, updatedRearBumper) => {
    try {
      const response = await updateRearBumper(rearbumperID, updatedRearBumper);

      if (response?.data?.success) {
        showToast('RearBumper updated successfully', 'success');
      } else {
        showToast('RearBumper not updated', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const handleUpdateRearBumper = async (rearbumperID, value, control) => {
    const rearbumper = rearbumperList.filter((rearbumper) => rearbumper._id === rearbumperID)?.[0];

    if (!rearbumper) return;

    const updatedRearBumper = {
      ...rearbumper,
      [control]: value
    };
    setRearBumperList((prev) => prev.map((rearbumper) => (rearbumper._id === rearbumperID ? updatedRearBumper : rearbumper)));

    if (control === 'status') {
      saveRearBumper(rearbumperID, updatedRearBumper);
    }
  };

  const handleEditRearBumper = (id, flag) => {
    setEditStatus(true);
    setRearBumperList(rearbumperList.map((rearbumper) => (rearbumper._id === id ? { ...rearbumper, editing: !rearbumper?.editing } : rearbumper)));

    const result = rearbumperList.filter((rearbumper) => rearbumper._id === id)?.[0];
    setOpen(true);

    setRearBumperForm({
      ...rearbumperForm,
      rearbumperThumbnail: null,
      rearbumperThumbnailPath: result?.thumbnailPath,
      rearbumperThumbnailFileName: result?.thumbnailFileName,
     rearbumperName: result?.rearbumperName,
      previewRearBumperThumbnail: `${SERVER_URL}/${result?.thumbnailPath}`,
      status: result?.status ? 'active' : 'inactive',
      rearbumperId: result?._id,
      rearbumperModel: null,
      rearbumperModelPath: result?.modelPath,
      rearbumperModelFileName: result?.modelFileName,
      cost: result?.cost,
      description: result?.description
    });
  };

  const handleCreateRearBumper = async () => {
    if (rearbumperForm?.rearbumperThumbnailFileName && rearbumperForm?.rearbumperName && rearbumperForm?.rearbumperModelFileName) {
      try {
        const formData = new FormData();
        if (rearbumperForm?.rearbumperThumbnail) {
          formData.append('rearbumperThumbnail', rearbumperForm?.rearbumperThumbnail);
        }

        if (rearbumperForm?.rearbumperModel) {
          formData.append('rearbumperModel', rearbumperForm?.rearbumperModel);
        }
        formData.append('rearbumperName', rearbumperForm?.rearbumperName);
        formData.append('description', rearbumperForm?.description);
        formData.append('cost', rearbumperForm?.cost);
        formData.append('status', rearbumperForm?.status === 'active' ? true : false);
        if (editStatus) {
          formData.append('rearbumperId', rearbumperForm?.rearbumperId);
        }

        const response = await createRearBumper(formData);
        if (response?.data?.success) {
          setRearBumperForm({
            ...rearbumperForm,
            rearbumperThumbnail: null,
            rearbumperThumbnailPath: null,
            rearbumperThumbnailFileName: null,
            rearbumperName: null,
            previewRearBumperThumbnail: null,
            rearbumperModel: null,
            rearbumperModelPath: null,
            rearbumperModelFileName: null,
            cost: null,
            description: null
          });

          setRearBumperList((prev) => {
            const index = prev.findIndex((item) => item._id === response.data.data._id);

            if (index !== -1) {
              // update rearbumper
              const updated = [...prev];
              updated[index] = response.data.data;
              return updated;
            }

            // Create rearbumper
            return [...prev, response.data.data];
          });
          setOpen(false);

          showToast('RearBumper created successfully', 'success');
        } else {
          showToast('RearBumper not created', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    } else {
      showToast('Please fill all values in the form', 'error');
    }
  };

  const handleDeleteRearBumper = (rearbumperID) => {
    const filtered = rearbumperList.filter((rearbumper) => rearbumper._id === rearbumperID)?.[0];
    console.log(filtered);
    setRearBumperData(filtered);
    setDeleteOpen(true);
  };

  const rearbumperConformDelete = async () => {
    try {
      const { data } = await deleteRearBumper(rearbumperData?._id);
      if (data.success) {
        setRearBumperList(rearbumperList.filter((rearbumper) => rearbumper._id !== rearbumperData?._id));

        showToast('RearBumper deleted successfully', 'success');
        setDeleteOpen(false);
      } else {
        showToast('RearBumper not delete', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const uploadModelfn = (e) => {
    setRearBumperForm({
      ...rearbumperForm,
      rearbumperModel: e.target.files[0],
      rearbumperModelFileName: e.target.files[0]?.name
    });
    e.target.value = '';
  };

  const addRearBumperfn = (e) => {
    setRearBumperForm({
      ...rearbumperForm,
      rearbumperThumbnail: null,
      rearbumperThumbnailPath: null,
      rearbumperThumbnailFileName: null,
      rearbumperModel: null,
      rearbumperModelPath: null,
      rearbumperModelFileName: null,
      rearbumperName: null,
      cost: null,
      description: null,
      previewRearBumperThumbnail: null,
      status: 'inactive',
      rearbumperId: null
    });
    setOpen(true);
    setEditStatus(false);
  };

  const filteredRearBumper = rearbumperList.filter((rearbumper) => {
    const matchesSearch = !searchTerm || rearbumper._id === searchTerm;

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
      <h1>RearBumper - Management</h1>

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
          onClick={() => addRearBumperfn()}
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
          {filteredRearBumper.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: 'center',
                  padding: '20px'
                }}
              >
                No RearBumper Found
              </td>
            </tr>
          ) : (
            filteredRearBumper.map((rearbumpers, index) => (
              <tr key={rearbumpers._id}>
                <td style={tdStyle}>
                  <Avatar src={`${SERVER_URL}/${rearbumpers.thumbnailPath}`} alt={rearbumpers.rearbumperName} sx={{ width: 40, height: 40 }} />
                </td>

                <td style={tdStyle}>
                  <Typography fontWeight={600}>{rearbumpers.rearbumperName}</Typography>
                </td>

                <td style={tdStyle}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rearbumpers?.status}
                        onChange={(e) => handleUpdateRearBumper(rearbumpers._id, e.target.checked, 'status')}
                        color="success"
                      />
                    }
                    label={rearbumpers?.status ? 'Active' : 'Inactive'}
                  />
                </td>

                <td style={tdStyle}>
                  <Tooltip title={'Edit'}>
                    <IconButton color={'success'} onClick={() => handleEditRearBumper(rearbumpers._id, rearbumpers.editing)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteRearBumper(rearbumpers._id)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*RearBumper - upload dialog*/}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>RearBumper - Details</DialogTitle>

        <DialogContent>
          <Card elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Name
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="RearBumper Name"
                    value={rearbumperForm?.rearbumperName || ''}
                    fullWidth
                    onChange={(e) => {
                      setRearBumperForm({
                        ...rearbumperForm,
                        rearbumperName: e.target.value
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
                    value={rearbumperForm?.description || ''}
                    fullWidth
                    multiline
                    minRows={3}
                    onChange={(e) => {
                      setRearBumperForm({
                        ...rearbumperForm,
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
                    value={rearbumperForm?.cost || ''}
                    fullWidth
                    onChange={(e) => {
                      setRearBumperForm({
                        ...rearbumperForm,
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
                      value={rearbumperForm?.status}
                      onChange={(e) => {
                        setRearBumperForm({
                          ...rearbumperForm,
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
                    Upload RearBumper Model (.glb)
                    <input hidden type="file" accept=".glb" onChange={uploadModelfn} />
                  </Button>

                  <Typography variant="body2" color="text.secondary">
                    {rearbumperForm?.rearbumperModelFileName || 'No model selected'}
                  </Typography>
                </Stack>
              </Grid>

              {/* RearBumper thumbnail image Upload */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={2}>
                  <Button variant="contained" component="label" startIcon={<ImageIcon />}>
                    Upload RearBumper Thumbnail Image
                    <input hidden type="file" accept="image/*" onChange={uploadRearBumperfn} />
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
                      {rearbumperForm?.rearbumperThumbnailFileName || 'No thumbnail image selected'}
                    </Typography>
                  </Stack>
                  {rearbumperForm?.previewRearBumperThumbnail && (
                    <Box
                      component="img"
                      src={rearbumperForm?.previewRearBumperThumbnail}
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

          <Button variant="contained" onClick={() => handleCreateRearBumper()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete RearBumper</DialogTitle>

        <DialogContent>
          <DialogContentText>Are you sure you want to delete this rearbumper?</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={() => rearbumperConformDelete()}>
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
