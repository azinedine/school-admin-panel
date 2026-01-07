import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, FileText, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { usePrepStore, type MemoTemplate } from '@/store/prep-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function MemoLibrary() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const memos = usePrepStore((state) => state.getAllMemos())
  const addMemo = usePrepStore((state) => state.addMemo)
  const updateMemo = usePrepStore((state) => state.updateMemo)
  const deleteMemo = usePrepStore((state) => state.deleteMemo)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMemo, setEditingMemo] = useState<MemoTemplate | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    reference: '',
    date: format(new Date(), 'yyyy-MM-dd')
  })

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleOpenDialog = (memo?: MemoTemplate) => {
    if (memo) {
      setEditingMemo(memo)
      setFormData({
        title: memo.title,
        content: memo.content,
        reference: memo.reference || '',
        date: memo.date || format(new Date(), 'yyyy-MM-dd')
      })
    } else {
      setEditingMemo(null)
      setFormData({
        title: '',
        content: '',
        reference: '',
        date: format(new Date(), 'yyyy-MM-dd')
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingMemo) {
      updateMemo(editingMemo.id, formData)
      toast.success(t('messages.updateSuccess') || 'Memo updated')
    } else {
      addMemo(formData)
      toast.success(t('messages.createSuccess') || 'Memo created')
    }
    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteMemo(deleteId)
      toast.success(t('messages.deleteSuccess') || 'Memo deleted')
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{t('pages.prep.memos.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('pages.prep.memos.description')}</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {t('pages.prep.memos.addMemo')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memos.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/50">
            <FileText className="h-10 w-10 mb-4 opacity-50" />
            <p className="text-lg font-medium">{t('pages.prep.memos.emptyState')}</p>
            <Button variant="link" onClick={() => handleOpenDialog()} className="mt-2 text-primary">
              {t('pages.prep.memos.createFirst')}
            </Button>
          </div>
        ) : (
          memos.map((memo) => (
            <Card key={memo.id} className="group hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold line-clamp-1" title={memo.title}>
                      {memo.title}
                    </CardTitle>
                    {memo.reference && (
                      <CardDescription className="font-mono text-xs">
                        Ref: {memo.reference}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(memo)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(memo.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap min-h-[4.5rem]">
                  {memo.content}
                </p>
                {memo.date && (
                  <div className="flex items-center text-xs text-muted-foreground pt-2 border-t mt-auto">
                    <Calendar className={cn("h-3 w-3", isRTL ? "ml-1" : "mr-1")} />
                    {memo.date}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingMemo ? t('pages.prep.memos.editMemo') : t('pages.prep.memos.addMemo')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('pages.prep.memos.form.title')}</Label>
              <Input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder={t('pages.prep.memos.form.titlePlaceholder')}
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label>{t('pages.prep.memos.form.reference')}</Label>
                <Input 
                  value={formData.reference} 
                  onChange={e => setFormData({...formData, reference: e.target.value})}
                  placeholder="Ref-001" 
                />
              </div>
              <div className="space-y-2">
                <Label>{t('pages.prep.memos.form.date')}</Label>
                <Input 
                  type="date"
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('pages.prep.memos.form.content')}</Label>
              <Textarea 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
                placeholder={t('pages.prep.memos.form.contentPlaceholder')}
                placeholder-shown="Type your memo here..."
                className="min-h-[150px]"
                required 
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>{t('pages.prep.memos.deleteConfirm')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
