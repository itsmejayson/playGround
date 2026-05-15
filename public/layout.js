const loadLayout = async () => {
  try {
    const header = await fetch('/header.html').then(res => res.text());
    const footer = await fetch('/footer.html').then(res => res.text());

    document.getElementById('header').innerHTML = header;
    document.getElementById('footer').innerHTML = footer;

    // ✅ display logged-in user
    const userName = localStorage.getItem('userName');
    if (userName) {
      document.getElementById('userName').textContent = userName;
    }

  } catch (err) {
    console.error(err);
  }
};