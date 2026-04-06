export const STATUS_MAP = {
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