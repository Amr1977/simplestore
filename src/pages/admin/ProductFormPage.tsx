import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, createProduct, updateProduct, getCategories } from '@/firebase/firestore'
import ProductForm from '@/components/admin/ProductForm'
import type { Product, Category } from '@/types'

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Partial<Product> | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const isEdit = id !== 'new'

  useEffect(() => {
    async function load() {
      const cats = await getCategories('abu-qir-demo')
      setCategories(cats)
      if (isEdit && id) {
        const data = await getProduct('abu-qir-demo', id)
        setProduct(data)
      }
      setLoading(false)
    }
    load()
  }, [id, isEdit])

  const handleSave = async (data: Partial<Product>) => {
    if (isEdit && id) {
      await updateProduct('abu-qir-demo', id, data)
    } else {
      await createProduct('abu-qir-demo', data)
    }
    navigate('/admin/products')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <ProductForm
      product={product}
      storeId="abu-qir-demo"
      categories={categories}
      onSave={handleSave}
      onCancel={() => navigate('/admin/products')}
    />
  )
}
