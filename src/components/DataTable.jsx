import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Box,
  Typography
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

function DataTable({ columns, data, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No hay datos disponibles
        </Typography>
      </Paper>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'primary.main' }}>
            {columns.map((col) => (
              <TableCell key={col.key} sx={{ color: 'white', fontWeight: 600 }}>
                {col.label}
              </TableCell>
            ))}
            {(onEdit || onDelete) && (
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Acciones</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.id || index}
              sx={{
                '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key] || '-'}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {onEdit && (
                      <IconButton
                        onClick={() => onEdit(row)}
                        color="primary"
                        size="small"
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton
                        onClick={() => onDelete(row)}
                        color="error"
                        size="small"
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DataTable
