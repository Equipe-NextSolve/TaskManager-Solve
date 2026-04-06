'use client'

import { useState, useMemo, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'sonner'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdClose,
  MdFilterList,
  MdMoreVert,
  MdOutlineRocketLaunch,
  MdCalendarToday,
  MdOutlineTimer,
  MdLink,
  MdComputer,
  MdPerson,
  MdOutlineFlag,
  MdCheckCircle,
  MdPauseCircle,
  MdOutlineLoop,
  MdArchive,
  MdCode,
  MdGroup,
} from 'react-icons/md'
import { RiGitBranchLine } from 'react-icons/ri'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
  Menu,
  Tooltip,
  Checkbox,
  ListItemText,
  Chip,
  OutlinedInput,
} from '@mui/material'
import { useProjects } from '@/context/ProjectsContext'

// ─── MAPS ─────────────────────────────────────────────────────────────────────

const STATUS_MAP = {
  em_andamento: {
    label: 'Em Andamento',
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.12)',
    border: 'rgba(34,211,238,0.25)',
    icon: MdOutlineLoop,
  },
  concluido: {
    label: 'Concluído',
    color: '#19CA68',
    bg: 'rgba(25,202,104,0.12)',
    border: 'rgba(25,202,104,0.25)',
    icon: MdCheckCircle,
  },
  pausado: {
    label: 'Pausado',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    icon: MdPauseCircle,
  },
  arquivado: {
    label: 'Arquivado',
    color: '#6b7280',
    bg: 'rgba(107,114,128,0.12)',
    border: 'rgba(107,114,128,0.25)',
    icon: MdArchive,
  },
}

const PRIORITY_MAP = {
  baixa:   { label: 'Baixa',   color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  media:   { label: 'Média',   color: '#22d3ee', bg: 'rgba(34,211,238,0.12)'  },
  alta:    { label: 'Alta',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  critica: { label: 'Crítica', color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
}

// ─── SCHEMA ───────────────────────────────────────────────────────────────────

const projectSchema = yup.object({
  title:         yup.string().min(3, 'Mínimo 3 caracteres').required('Título obrigatório'),
  description:   yup.string().optional(),
  client:        yup.string().optional(),
  status:        yup.string().oneOf(Object.keys(STATUS_MAP)).required(),
  priority:      yup.string().oneOf(Object.keys(PRIORITY_MAP)).required(),
  developers:    yup.array().of(yup.string()).min(1, 'Selecione ao menos um desenvolvedor'),
  startDate:     yup.string().optional(),
  deliveryDate:  yup.string().optional(),
  techStack:     yup.string().optional(), // comma-separated → array on submit
  repositoryUrl: yup
  .string()
  .transform((value) => (value === '' ? undefined : value)) // Transforma string vazia em undefined
  .url('URL inválida')
  .nullable()
  .optional(),
  hosting:       yup.string().optional(),
})

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase()).join('')
}

const AVATAR_COLORS = [
  '#19CA68','#22d3ee','#f59e0b','#a78bfa','#ef4444',
  '#fb923c','#34d399','#60a5fa','#f472b6','#facc15',
]
function avatarColor(uid = '') {
  let hash = 0
  for (const c of uid) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function Avatar({ name, uid, size = 32 }) {
  const color = avatarColor(uid || name)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}20`, border: `2px solid ${color}50`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, color, flexShrink: 0,
    }}>
      {getInitials(name)}
    </div>
  )
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status]
  if (!s) return null
  const Icon = s.icon
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      <Icon size={11} />{s.label}
    </span>
  )
}

function PriorityBadge({ priority }) {
  const p = PRIORITY_MAP[priority]
  if (!p) return null
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
      borderRadius: 20, fontSize: 10, fontWeight: 700, color: p.color,
      background: p.bg, textTransform: 'uppercase', letterSpacing: '0.06em',
      whiteSpace: 'nowrap',
    }}>
      {p.label}
    </span>
  )
}

// MUI dark overrides
const muiDark = {
  '& .MuiOutlinedInput-root': {
    color: '#e5e7eb',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: '#19CA68' },
    '& .MuiSelect-icon': { color: '#9ca3af' },
    '& .MuiChip-root': { background: 'rgba(25,202,104,0.15)', color: '#19CA68', fontSize: 11 },
  },
  '& .MuiInputLabel-root': { color: '#9ca3af' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#19CA68' },
  '& .MuiFormHelperText-root': { color: '#ef4444' },
  '& .MuiOutlinedInput-input': { color: '#e5e7eb' },
}

const menuPaper = {
  PaperProps: {
    style: { background: '#171C23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 },
  },
}

// ─── PROJECT FORM DIALOG ──────────────────────────────────────────────────────

function ProjectFormDialog({ open, onClose, project, users, onSubmit, loading }) {
  const isEdit = Boolean(project)

  const {
    register, handleSubmit, control, reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: '', description: '', client: '',
      status: 'em_andamento', priority: 'media',
      developers: [], startDate: '', deliveryDate: '',
      techStack: '', repositoryUrl: '', hosting: '',
    },
  })

  // Populate on open
  useState(() => {})
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useMemo(() => {
    if (!open) return
    if (project) {
      reset({
        title:         project.title         || '',
        description:   project.description   || '',
        client:        project.client        || '',
        status:        project.status        || 'em_andamento',
        priority:      project.priority      || 'media',
        developers:    project.developers    || [],
        startDate:     project.startDate     || '',
        deliveryDate:  project.deliveryDate  || '',
        techStack:     Array.isArray(project.techStack)
                         ? project.techStack.join(', ')
                         : (project.techStack || ''),
        repositoryUrl: project.repositoryUrl || '',
        hosting:       project.hosting       || '',
      })
    } else {
      reset({
        title: '', description: '', client: '',
        status: 'em_andamento', priority: 'media',
        developers: [], startDate: '', deliveryDate: '',
        techStack: '', repositoryUrl: '', hosting: '',
      })
    }
  }, [open, project])

  const handleClose = () => { if (!loading) onClose() }

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      techStack: data.techStack
        ? data.techStack.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
      PaperProps={{ style: {
        background: '#171C23',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
      }}}
    >
      <DialogTitle style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(25,202,104,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MdOutlineRocketLaunch style={{ color: '#19CA68', fontSize: 18 }} />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
            {isEdit ? 'Editar Projeto' : 'Novo Projeto'}
          </span>
        </div>
        <button onClick={handleClose} disabled={loading} type='button'
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4, borderRadius: 6, display: 'flex' }}>
          <MdClose size={20} />
        </button>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Title + Client */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextField label="Título *" {...register('title')}
              error={Boolean(errors.title)} helperText={errors.title?.message}
              fullWidth size="small" sx={muiDark} />
            <TextField label="Cliente" {...register('client')}
              fullWidth size="small" sx={muiDark}
              InputProps={{ startAdornment: <MdPerson size={15} style={{ color: '#6b7280', marginRight: 6 }} /> }} />
          </div>

          {/* Description */}
          <TextField label="Descrição" {...register('description')}
            multiline rows={3} fullWidth size="small" sx={muiDark} />

          {/* Status + Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormControl size="small" error={Boolean(errors.status)} sx={muiDark}>
              <InputLabel>Status *</InputLabel>
              <Controller name="status" control={control} render={({ field }) => (
                <Select {...field} label="Status *" MenuProps={menuPaper}>
                  {Object.entries(STATUS_MAP).map(([val, cfg]) => (
                    <MenuItem key={val} value={val} style={{ color: cfg.color, fontSize: 13 }}>
                      {cfg.label}
                    </MenuItem>
                  ))}
                </Select>
              )} />
            </FormControl>

            <FormControl size="small" error={Boolean(errors.priority)} sx={muiDark}>
              <InputLabel>Prioridade *</InputLabel>
              <Controller name="priority" control={control} render={({ field }) => (
                <Select {...field} label="Prioridade *" MenuProps={menuPaper}>
                  {Object.entries(PRIORITY_MAP).map(([val, cfg]) => (
                    <MenuItem key={val} value={val} style={{ color: cfg.color, fontSize: 13 }}>
                      {cfg.label}
                    </MenuItem>
                  ))}
                </Select>
              )} />
            </FormControl>
          </div>

          {/* Developers multi-select */}
          <FormControl size="small" error={Boolean(errors.developers)} sx={muiDark} fullWidth>
            <InputLabel>Desenvolvedores *</InputLabel>
            <Controller name="developers" control={control} render={({ field }) => (
              <Select
                {...field}
                multiple
                label="Desenvolvedores *"
                input={<OutlinedInput label="Desenvolvedores *" />}
                MenuProps={menuPaper}
                renderValue={(selected) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {selected.map((uid) => {
                      const u = users.find((x) => x.id === uid)
                      return (
                        <Chip
                          key={uid}
                          label={u?.name || uid}
                          size="small"
                          style={{ background: 'rgba(25,202,104,0.15)', color: '#19CA68', fontSize: 11, height: 22 }}
                        />
                      )
                    })}
                  </div>
                )}
              >
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id} style={{ fontSize: 13 }}>
                    <Checkbox
                      checked={field.value?.includes(u.id)}
                      size="small"
                      sx={{ color: '#6b7280', '&.Mui-checked': { color: '#19CA68' }, padding: '0 8px 0 0' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={u.name} uid={u.id} size={22} />
                      <span style={{ color: '#e5e7eb' }}>{u.name}</span>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>({u.role || 'membro'})</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            )} />
            {errors.developers && <FormHelperText>{errors.developers.message}</FormHelperText>}
          </FormControl>

          {/* StartDate + DeliveryDate */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextField label="Data de Início" type="date" {...register('startDate')}
              fullWidth size="small" InputLabelProps={{ shrink: true }} sx={muiDark} />
            <TextField label="Data de Entrega" type="date" {...register('deliveryDate')}
              fullWidth size="small" InputLabelProps={{ shrink: true }} sx={muiDark} />
          </div>

          {/* TechStack + Hosting */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextField label="Tech Stack (separado por vírgula)"
              {...register('techStack')} fullWidth size="small" sx={muiDark}
              placeholder="React, Node.js, Firebase..."
              InputProps={{ startAdornment: <MdCode size={15} style={{ color: '#6b7280', marginRight: 6 }} /> }} />
            <TextField label="Hosting" {...register('hosting')}
              fullWidth size="small" sx={muiDark}
              placeholder="Vercel, AWS, Netlify..."
              InputProps={{ startAdornment: <MdComputer size={15} style={{ color: '#6b7280', marginRight: 6 }} /> }} />
          </div>

          {/* Repository URL */}
          <TextField label="URL do Repositório" {...register('repositoryUrl')}
            error={Boolean(errors.repositoryUrl)} helperText={errors.repositoryUrl?.message}
            fullWidth size="small" sx={muiDark}
            placeholder="https://github.com/..."
            InputProps={{ startAdornment: <RiGitBranchLine size={15} style={{ color: '#6b7280', marginRight: 6 }} /> }} />

        </DialogContent>

        <DialogActions style={{ padding: '12px 24px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', gap: 8 }}>
          <button type="button" onClick={handleClose} disabled={loading}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, color: '#9ca3af', padding: '8px 20px',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading}
            style={{
              background: loading ? 'rgba(25,202,104,0.4)' : 'linear-gradient(135deg, #19CA68, #1AD76F)',
              border: 'none', borderRadius: 8, color: '#000',
              padding: '8px 24px', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: loading ? 'none' : '0 4px 14px rgba(25,202,104,0.35)',
            }}>
            {loading && <CircularProgress size={14} style={{ color: '#000' }} />}
            {isEdit ? 'Salvar Alterações' : 'Criar Projeto'}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

// ─── DELETE DIALOG ────────────────────────────────────────────────────────────

function DeleteDialog({ open, onClose, project, onConfirm, loading }) {
  return (
    <Dialog open={open} onClose={() => !loading && onClose()} maxWidth="xs" fullWidth
      PaperProps={{ style: {
        background: '#171C23', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16,
      }}}>
      <DialogTitle style={{ color: '#fff', fontWeight: 700, fontSize: 16, paddingBottom: 8 }}>
        Excluir Projeto
      </DialogTitle>
      <DialogContent style={{ paddingTop: 0 }}>
        <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.6 }}>
          Tem certeza que deseja excluir{' '}
          <span style={{ color: '#fff', fontWeight: 600 }}>"{project?.title}"</span>?
          Esta ação não pode ser desfeita.
        </p>
      </DialogContent>
      <DialogActions style={{ padding: '8px 24px 20px', gap: 8 }}>
        <button onClick={onClose} disabled={loading} type='button'
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: '#9ca3af', padding: '8px 20px',
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>
          Cancelar
        </button>
        <button onClick={onConfirm} disabled={loading} type='button'
          style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            border: 'none', borderRadius: 8, color: '#fff',
            padding: '8px 20px', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 6,
            opacity: loading ? 0.7 : 1,
          }}>
          {loading ? <CircularProgress size={13} style={{ color: '#fff' }} /> : <MdDelete size={15} />}
          Excluir
        </button>
      </DialogActions>
    </Dialog>
  )
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────

function ProjectCard({ project, usersMap, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const developers = (project.developers || [])
    .map((uid) => usersMap[uid])
    .filter(Boolean)

  const createdBy = usersMap[project.createdBy]
  const lastModifiedBy = usersMap[project.lastModifiedBy]

  const deliveryInfo = useMemo(() => {
  if (!project.deliveryDate) return null

  const due = project.deliveryDate?.toDate
    ? project.deliveryDate.toDate()
    : new Date(project.deliveryDate)

  const diff = differenceInDays(due, new Date())
  const formatted = format(due, 'dd/MM/yyyy')

  if (diff < 0)  return { text: `${Math.abs(diff)}d atrasado`, color: '#ef4444', formatted }
  if (diff <= 7) return { text: `${diff}d restantes`, color: '#f59e0b', formatted }
  return { text: formatted, color: '#6b7280', formatted }
}, [project.deliveryDate])

  const techStack = Array.isArray(project.techStack) ? project.techStack : []

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <>
<div
      style={{
        background: '#121212',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: '18px',
        display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'border-color 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(25,202,104,0.2)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, lineHeight: 1.3, marginBottom: 8 }}>
            {project.title}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
        </div>

        <button
          onClick={(e) => setAnchorEl(e.currentTarget)} type='button'
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6b7280', padding: 4, borderRadius: 6, display: 'flex', flexShrink: 0,
          }}
          // biome-ignore lint/suspicious/noAssignInExpressions: <>
          onMouseEnter={(e) => (e.currentTarget.style.color = '#e5e7eb')}
          // biome-ignore lint/suspicious/noAssignInExpressions: <>
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
        >
          <MdMoreVert size={18} />
        </button>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
          PaperProps={{ style: {
            background: '#1e2430', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.6)', minWidth: 140,
          }}}>
          <MenuItem onClick={() => { setAnchorEl(null); onEdit(project) }}
            style={{ color: '#e5e7eb', fontSize: 13, gap: 8 }}>
            <MdEdit size={15} style={{ color: '#22d3ee' }} /> Editar
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); onDelete(project) }}
            style={{ color: '#ef4444', fontSize: 13, gap: 8 }}>
            <MdDelete size={15} /> Excluir
          </MenuItem>
        </Menu>
      </div>

      {/* ── Client ── */}
      {project.client && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MdPerson size={13} style={{ color: '#6b7280', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{project.client}</span>
        </div>
      )}

      {/* ── Description ── */}
      {project.description && (
        <p style={{ color: '#6b7280', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
          {project.description.length > 100
            ? project.description.slice(0, 100) + '…'
            : project.description}
        </p>
      )}

      {/* ── Tech Stack ── */}
      {techStack.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {techStack.map((tech) => (
            <span key={tech} style={{
              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
              background: 'rgba(34,211,238,0.08)', color: '#22d3ee',
              border: '1px solid rgba(34,211,238,0.15)',
              letterSpacing: '0.03em',
            }}>
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* ── Developers ── */}
      {developers.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MdGroup size={13} style={{ color: '#6b7280', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {developers.slice(0, 4).map((dev, i) => (
              <Tooltip key={dev.id} title={dev.name} arrow>
                <div style={{ marginLeft: i === 0 ? 0 : -8, zIndex: developers.length - i }}>
                  <Avatar name={dev.name} uid={dev.id} size={26} />
                </div>
              </Tooltip>
            ))}
            {developers.length > 4 && (
              <span style={{
                marginLeft: -8, width: 26, height: 26, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)', border: '2px solid #121212',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: '#9ca3af',
              }}>
                +{developers.length - 4}
              </span>
            )}
          </div>
          <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 4 }}>
            {developers.length} dev{developers.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)',
        flexWrap: 'wrap', gap: 8,
      }}>
        {/* Dates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {project.startDate && (
            <span>
                Início: {
                format(
                    project.startDate?.toDate
                    ? project.startDate.toDate()
                    : new Date(project.startDate),
                    'dd/MM/yyyy'
                )
                }
            </span>
            )}
          {deliveryInfo && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: deliveryInfo.color, fontWeight: 600 }}>
              <MdOutlineTimer size={11} />
              {deliveryInfo.text !== deliveryInfo.formatted
                ? `Entrega: ${deliveryInfo.formatted} · ${deliveryInfo.text}`
                : `Entrega: ${deliveryInfo.formatted}`}
            </span>
          )}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 6 }}>
          {project.repositoryUrl && (
            <Tooltip title="Repositório" arrow>
              <a href={project.repositoryUrl} target="_blank" rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 7,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#9ca3af', textDecoration: 'none', transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#19CA68'; e.currentTarget.style.borderColor = 'rgba(25,202,104,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                <RiGitBranchLine size={14} />
              </a>
            </Tooltip>
          )}
          {project.hosting && (
            <Tooltip title={`Hosting: ${project.hosting}`} arrow>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 10px', borderRadius: 7,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 10, color: '#6b7280',
              }}>
                <MdComputer size={12} />{project.hosting}
              </div>
            </Tooltip>
          )}
        </div>
      </div>

      {/* ── Meta ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
        {createdBy && (
          <span style={{ fontSize: 10, color: '#4b4b4b' }}>
            Criado por <span style={{ color: '#6b7280', fontWeight: 600 }}>{createdBy.name}</span>
          </span>
        )}
        {lastModifiedBy && project.lastModified && (
          <span style={{ fontSize: 10, color: '#4b4b4b' }}>
            Editado por <span style={{ color: '#6b7280', fontWeight: 600 }}>{lastModifiedBy.name}</span>
          </span>
        )}
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function ProjectsMain() {
  const { projects, users, usersMap, loadingProjects, createProject, updateProject, deleteProject } = useProjects()

  const [search, setSearch]               = useState('')
  const [filterStatus, setFilterStatus]   = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterDev, setFilterDev]         = useState('all')

  const [dialogOpen, setDialogOpen]       = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProject, setDeletingProject]   = useState(null)

  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting]     = useState(false)

  // ── Filtered ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filterStatus !== 'all' && p.status !== filterStatus) return false
      if (filterPriority !== 'all' && p.priority !== filterPriority) return false
      if (filterDev !== 'all' && !(p.developers || []).includes(filterDev)) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.client?.toLowerCase().includes(q) ||
          (p.techStack || []).some((t) => t.toLowerCase().includes(q)) ||
          (p.developers || []).some((uid) => usersMap[uid]?.name?.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [projects, filterStatus, filterPriority, filterDev, search, usersMap])

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:       projects.length,
    em_andamento: projects.filter((p) => p.status === 'em_andamento').length,
    concluido:   projects.filter((p) => p.status === 'concluido').length,
    pausado:     projects.filter((p) => p.status === 'pausado').length,
  }), [projects])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleOpenCreate = () => { setEditingProject(null); setDialogOpen(true) }
  const handleOpenEdit   = useCallback((p) => { setEditingProject(p); setDialogOpen(true) }, [])
  const handleOpenDelete = useCallback((p) => { setDeletingProject(p); setDeleteDialogOpen(true) }, [])

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data)
        toast.success('Projeto atualizado!')
      } else {
        await createProject(data)
        toast.success('Projeto criado!')
      }
      setDialogOpen(false)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar projeto')
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteProject(deletingProject.id)
      toast.success('Projeto excluído!')
      setDeleteDialogOpen(false)
      setDeletingProject(null)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao excluir projeto')
    } finally {
      setDeleting(false)
    }
  }

  const clearFilters = () => { setFilterStatus('all'); setFilterPriority('all'); setFilterDev('all'); setSearch('') }
  const hasFilters = filterStatus !== 'all' || filterPriority !== 'all' || filterDev !== 'all' || search

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background-page text-white py-6 space-y-6 font-sans">

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <MdOutlineRocketLaunch style={{ color: '#19CA68', fontSize: 18 }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4b4b4b' }}>
              Gestão de Projetos
            </span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0 }}>Projetos</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            {projects.length} projeto{projects.length !== 1 ? 's' : ''} cadastrado{projects.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button onClick={handleOpenCreate} type='button'
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'linear-gradient(135deg, #19CA68, #1AD76F)',
            border: 'none', borderRadius: 10, color: '#000',
            padding: '10px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 700,
            boxShadow: '0 4px 14px rgba(25,202,104,0.3)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(25,202,104,0.45)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(25,202,104,0.3)' }}
        >
          <MdAdd size={18} /> Novo Projeto
        </button>
      </div>

      {/* STAT PILLS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {[
          { label: 'Total',        value: stats.total,        color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
          { label: 'Em Andamento', value: stats.em_andamento, color: '#22d3ee', bg: 'rgba(34,211,238,0.1)',  border: 'rgba(34,211,238,0.2)'  },
          { label: 'Concluídos',   value: stats.concluido,    color: '#19CA68', bg: 'rgba(25,202,104,0.1)', border: 'rgba(25,202,104,0.2)'  },
          { label: 'Pausados',     value: stats.pausado,      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)'  },
        ].map((s) => (
          <div key={s.label} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 24,
            background: s.bg, border: `1px solid ${s.border}`, fontSize: 13,
          }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</span>
            <span style={{ color: '#6b7280', fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 10, padding: '14px 16px',
        background: '#121212', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14, alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
          <MdSearch size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar projetos, clientes, tecnologias..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
              color: '#e5e7eb', padding: '7px 10px 7px 32px', fontSize: 13,
              outline: 'none', boxSizing: 'border-box',
            }} />
        </div>

        <MdFilterList size={16} style={{ color: '#6b7280', flexShrink: 0 }} />

        {[
          { value: filterStatus,   onChange: setFilterStatus,   options: [['all', 'Todos status'], ...Object.entries(STATUS_MAP).map(([v, c]) => [v, c.label])] },
          { value: filterPriority, onChange: setFilterPriority, options: [['all', 'Todas prioridades'], ...Object.entries(PRIORITY_MAP).map(([v, c]) => [v, c.label])] },
          { value: filterDev,      onChange: setFilterDev,      options: [['all', 'Todos devs'], ...users.map((u) => [u.id, u.name])] },
        ].map((f, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <>
<select key={i} value={f.value} onChange={(e) => f.onChange(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, color: '#9ca3af', padding: '7px 12px',
              fontSize: 12, cursor: 'pointer', outline: 'none',
            }}>
            {f.options.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        ))}

        {hasFilters && (
          <button onClick={clearFilters} type='button' style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, color: '#ef4444', padding: '6px 12px',
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}>
            <MdClose size={13} /> Limpar
          </button>
        )}
      </div>

      {/* GRID */}
      {loadingProjects ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
          <CircularProgress size={24} style={{ color: '#19CA68' }} />
          <span style={{ color: '#6b7280', fontSize: 14 }}>Carregando projetos...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '60px 0', gap: 12, background: '#121212',
          border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16,
        }}>
          <MdOutlineRocketLaunch style={{ fontSize: 44, color: '#2D2D2D' }} />
          <p style={{ color: '#4b4b4b', fontSize: 14, fontWeight: 600 }}>
            {projects.length === 0 ? 'Nenhum projeto cadastrado ainda' : 'Nenhum projeto encontrado'}
          </p>
          {projects.length === 0 && (
            <button onClick={handleOpenCreate} type='button' style={{
              marginTop: 4, background: 'rgba(25,202,104,0.1)',
              border: '1px solid rgba(25,202,104,0.2)', borderRadius: 8, color: '#19CA68',
              padding: '8px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <MdAdd size={16} /> Criar primeiro projeto
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              usersMap={usersMap}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* DIALOGS */}
      <ProjectFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        project={editingProject}
        users={users}
        onSubmit={handleSubmit}
        loading={submitting}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setDeletingProject(null) }}
        project={deletingProject}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  )
}