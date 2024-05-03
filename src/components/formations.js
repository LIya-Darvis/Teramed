function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    // Изменяем формат на day.month.year
    return date.toLocaleDateString('en-GB', options).replace(/\./g, '/');

}

export { formatDate }