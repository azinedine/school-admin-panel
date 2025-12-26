import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, Search, Building2, MapPin, Filter, RotateCcw, Loader2, School, AlertCircle } from 'lucide-react'
import { ContentPage } from '@/components/layout/content-page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FullScreenLoader } from '@/components/ui/full-screen-loader'
import {
  useInstitutions,
  useWilayas,
  useMunicipalities,
  useCreateInstitution,
  useUpdateInstitution,
  useDeleteInstitution,
  type Institution,
} from '@/hooks/use-institutions'

export const Route = createFileRoute('/_authenticated/super-admin/institutions')({
  component: InstitutionsPage,
})

const INSTITUTION_TYPES = ['primary', 'middle', 'secondary', 'university', 'vocational', 'other'] as const

function InstitutionsPage() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  // Filters
  const [filters, setFilters] = useState({
    wilaya_id: undefined as number | undefined,
    municipality_id: undefined as number | undefined,
    type: undefined as string | undefined,
    search: '',
    per_page: 15,
  })

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    wilaya_id: 0,
    municipality_id: 0,
    name: '',
    name_ar: '',
    address: '',
    phone: '',
    email: '',
    type: 'primary' as string,
    is_active: true,
  })

  // Queries
  const { data: institutionsData, isLoading, error } = useInstitutions(filters)
  const { data: wilayas } = useWilayas()
  const { data: filterMunicipalities } = useMunicipalities(filters.wilaya_id)
  const { data: formMunicipalities } = useMunicipalities(formData.wilaya_id || undefined)

  // Mutations
  const createInstitution = useCreateInstitution()
  const updateInstitution = useUpdateInstitution()
  const deleteInstitution = useDeleteInstitution()

  // Reset municipality when wilaya changes
  useEffect(() => {
    if (filters.wilaya_id) {
      setFilters(f => ({ ...f, municipality_id: undefined }))
    }
  }, [filters.wilaya_id])

  useEffect(() => {
    if (formData.wilaya_id) {
      setFormData(f => ({ ...f, municipality_id: 0 }))
    }
  }, [formData.wilaya_id])

  const openCreateDialog = () => {
    setSelectedInstitution(null)
    setFormData({
      wilaya_id: 0,
      municipality_id: 0,
      name: '',
      name_ar: '',
      address: '',
      phone: '',
      email: '',
      type: 'primary',
      is_active: true,
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (institution: Institution) => {
    setSelectedInstitution(institution)
    setFormData({
      wilaya_id: institution.wilaya_id,
      municipality_id: institution.municipality_id,
      name: institution.name,
      name_ar: institution.name_ar || '',
      address: institution.address || '',
      phone: institution.phone || '',
      email: institution.email || '',
      type: institution.type,
      is_active: institution.is_active,
    })
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (institution: Institution) => {
    setSelectedInstitution(institution)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedInstitution) {
      await updateInstitution.mutateAsync({ id: selectedInstitution.id, data: formData })
    } else {
      await createInstitution.mutateAsync(formData)
    }
    
    setIsDialogOpen(false)
  }

  const handleDelete = async () => {
    if (selectedInstitution) {
      await deleteInstitution.mutateAsync(selectedInstitution.id)
      setIsDeleteDialogOpen(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      wilaya_id: undefined,
      municipality_id: undefined,
      type: undefined,
      search: '',
      per_page: 15,
    })
  }

  if (isLoading) {
    return <FullScreenLoader message={t('common.loading')} />
  }

  if (error) {
    return (
      <ContentPage title={t('pages.institutions.title')} description={t('pages.institutions.description')}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t('common.error')}</AlertDescription>
        </Alert>
      </ContentPage>
    )
  }

  return (
    <ContentPage title={t('pages.institutions.title')} description={t('pages.institutions.description')}>
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-base">{t('common.filters')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                placeholder={t('common.search')}
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                className={isRTL ? 'pr-9' : 'pl-9'}
              />
            </div>

            {/* Wilaya */}
            <Select
              value={filters.wilaya_id?.toString() || 'all'}
              onValueChange={(v) => setFilters(f => ({ ...f, wilaya_id: v === 'all' ? undefined : Number(v) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('pages.institutions.selectWilaya')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                {wilayas?.map(w => (
                  <SelectItem key={w.id} value={w.id.toString()}>
                    {w.code} - {isRTL && w.name_ar ? w.name_ar : w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Municipality */}
            <Select
              value={filters.municipality_id?.toString() || 'all'}
              onValueChange={(v) => setFilters(f => ({ ...f, municipality_id: v === 'all' ? undefined : Number(v) }))}
              disabled={!filters.wilaya_id}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('pages.institutions.selectMunicipality')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                {filterMunicipalities?.map(m => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {isRTL && m.name_ar ? m.name_ar : m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type */}
            <Select
              value={filters.type || 'all'}
              onValueChange={(v) => setFilters(f => ({ ...f, type: v === 'all' ? undefined : v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('pages.institutions.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                {INSTITUTION_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {t(`pages.institutions.types.${type}`, type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button variant="outline" onClick={clearFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('common.clear')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {t('pages.institutions.title')}
            </CardTitle>
            <CardDescription>
              {t('pages.institutions.total', { count: institutionsData?.meta.total || 0 })}
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            {t('pages.institutions.add')}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('pages.institutions.name')}</TableHead>
                <TableHead>{t('pages.institutions.wilaya')}</TableHead>
                <TableHead>{t('pages.institutions.municipality')}</TableHead>
                <TableHead>{t('pages.institutions.type')}</TableHead>
                <TableHead>{t('pages.institutions.status')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {institutionsData?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <School className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    {t('pages.institutions.noInstitutions')}
                  </TableCell>
                </TableRow>
              ) : (
                institutionsData?.data.map((institution) => (
                  <TableRow key={institution.id}>
                    <TableCell>
                      <div className="font-medium">{institution.name}</div>
                      {institution.name_ar && (
                        <div className="text-sm text-muted-foreground">{institution.name_ar}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {institution.wilaya?.name || '-'}
                      </div>
                    </TableCell>
                    <TableCell>{institution.municipality?.name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {t(`pages.institutions.types.${institution.type}`, institution.type || 'other')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {institution.is_active ? (
                        <Badge variant="default">{t('common.active')}</Badge>
                      ) : (
                        <Badge variant="secondary">{t('common.inactive')}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(institution)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(institution)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedInstitution ? t('pages.institutions.edit') : t('pages.institutions.add')}
            </DialogTitle>
            <DialogDescription>
              {selectedInstitution ? t('pages.institutions.editDesc') : t('pages.institutions.addDesc')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('pages.institutions.wilaya')} *</Label>
                  <Select
                    value={formData.wilaya_id?.toString() || ''}
                    onValueChange={(v) => setFormData(f => ({ ...f, wilaya_id: Number(v) }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('pages.institutions.selectWilaya')} />
                    </SelectTrigger>
                    <SelectContent>
                      {wilayas?.map(w => (
                        <SelectItem key={w.id} value={w.id.toString()}>
                          {w.code} - {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('pages.institutions.municipality')} *</Label>
                  <Select
                    value={formData.municipality_id?.toString() || ''}
                    onValueChange={(v) => setFormData(f => ({ ...f, municipality_id: Number(v) }))}
                    disabled={!formData.wilaya_id}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('pages.institutions.selectMunicipality')} />
                    </SelectTrigger>
                    <SelectContent>
                      {formMunicipalities?.map(m => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('pages.institutions.name')} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_ar">{t('pages.institutions.nameAr')}</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData(f => ({ ...f, name_ar: e.target.value }))}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label>{t('pages.institutions.type')} *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData(f => ({ ...f, type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTITUTION_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {t(`pages.institutions.types.${type}`, type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('pages.institutions.phone')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('pages.institutions.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">{t('pages.institutions.address')}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(f => ({ ...f, address: e.target.value }))}
                />
              </div>

              {/* Active */}
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">{t('pages.institutions.isActive')}</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(f => ({ ...f, is_active: checked }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={createInstitution.isPending || updateInstitution.isPending}>
                {(createInstitution.isPending || updateInstitution.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {selectedInstitution ? t('common.update') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('pages.institutions.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('pages.institutions.deleteDesc', { name: selectedInstitution?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteInstitution.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentPage>
  )
}
