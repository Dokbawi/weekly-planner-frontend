import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TemplateList, TemplateForm } from '@/components/template'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useTemplateStore } from '@/stores/templateStore'
import { templateApi } from '@/api/templates'
import { WeeklyTemplate, TemplateDayPlan } from '@/types/template'
import { useToast } from '@/hooks/useToast'

export default function Templates() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<WeeklyTemplate | undefined>()
  const [isSaving, setIsSaving] = useState(false)
  const { templates, setTemplates, addTemplate, updateTemplate, removeTemplate, isLoading, setLoading } =
    useTemplateStore()
  const { toast } = useToast()

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const response: any = await templateApi.getList()
      const data = response?.data || response
      setTemplates(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '템플릿 목록 로드 실패' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: { name: string; description?: string; dayPlans: TemplateDayPlan[] }) => {
    setIsSaving(true)
    try {
      const response: any = await templateApi.create(data)
      const created = response?.data || response
      addTemplate(created)
      setIsFormOpen(false)
      toast({ title: '템플릿이 생성되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '템플릿 생성 실패' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (data: { name: string; description?: string; dayPlans: TemplateDayPlan[] }) => {
    if (!editingTemplate) return
    setIsSaving(true)
    try {
      const response: any = await templateApi.update(editingTemplate.id, data)
      const updated = response?.data || response
      updateTemplate(updated)
      setEditingTemplate(undefined)
      toast({ title: '템플릿이 수정되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '템플릿 수정 실패' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await templateApi.delete(id)
      removeTemplate(id)
      toast({ title: '템플릿이 삭제되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '템플릿 삭제 실패' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">주간 템플릿</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          새 템플릿
        </Button>
      </div>

      <TemplateList
        templates={templates}
        onEdit={(t) => setEditingTemplate(t)}
        onDelete={handleDelete}
      />

      {/* 생성 폼 */}
      <TemplateForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
        isLoading={isSaving}
      />

      {/* 수정 폼 */}
      <TemplateForm
        open={!!editingTemplate}
        onClose={() => setEditingTemplate(undefined)}
        onSubmit={handleUpdate}
        template={editingTemplate}
        isLoading={isSaving}
      />
    </div>
  )
}
