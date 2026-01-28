import { Skeleton, Box, Card, CardContent } from '@mui/material'

export function TableSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      {[...Array(5)].map((_, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
        </Box>
      ))}
    </Box>
  )
}

export function CardSkeleton() {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  )
}

export function DashboardSkeleton() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
      {[...Array(5)].map((_, index) => (
        <Card key={index}>
          <CardContent>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" height={40} sx={{ my: 2 }} />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
