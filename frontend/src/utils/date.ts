export const formatDate = {
  fullDate: (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  },
  time: (dateString: string | Date) => {
    return new Date(dateString).toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
};