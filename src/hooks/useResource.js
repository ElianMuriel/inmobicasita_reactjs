import { useState, useEffect } from 'react'

export function useResource(service, initialFilters = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    count: 0,
    totalPages: 0,
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {
        page: pagination.page,
        ...filters,
      }
      const response = await service.getAll(params)
      const results = response.data.results || response.data
      setData(results)
      
      if (response.data.count !== undefined) {
        setPagination(prev => ({
          ...prev,
          count: response.data.count,
          totalPages: Math.ceil(response.data.count / prev.pageSize),
        }))
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar los datos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [pagination.page, filters])

  const create = async (newData) => {
    try {
      const response = await service.create(newData)
      await loadData()
      return { success: true, data: response.data }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data || { detail: 'Error al crear' },
      }
    }
  }

  const update = async (id, updatedData) => {
    try {
      const response = await service.update(id, updatedData)
      await loadData()
      return { success: true, data: response.data }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data || { detail: 'Error al actualizar' },
      }
    }
  }

  const remove = async (id) => {
    try {
      await service.delete(id)
      await loadData()
      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data || { detail: 'Error al eliminar' },
      }
    }
  }

  const updateFilters = (newFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const changePage = (page) => {
    setPagination(prev => ({ ...prev, page }))
  }

  return {
    data,
    loading,
    error,
    filters,
    pagination,
    create,
    update,
    remove,
    updateFilters,
    changePage,
    reload: loadData,
  }
}
