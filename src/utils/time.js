const formatTime12h = (date) => {
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const hours12 = ((hours24 + 11) % 12) + 1;
  return `${hours12}:${minutes}`;
};

module.exports = {
  formatTime12h,
};
