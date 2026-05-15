const handleLogin = async (event) => {
  event.preventDefault();

  const email = document.querySelector('[name="email"]').value;
  const password = document.querySelector('[name="password"]').value;

  const payload = { email, password };

  try {
    const response = await fetch('/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // ✅ Success
    await Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: data.message,
      timer: 1500,
      showConfirmButton: false
    });

    localStorage.setItem('isLoggedIn', 'true');
    window.location.replace('/users.html');

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Something went wrong'
    });
  }
};

window.onload = () => {
  const form = document.querySelector('form');
  form.reset(); // ✅ clears all inputs
};

window.onpageshow = function (event) {
  if (event.persisted) {
    document.querySelector('form').reset(); // ✅ clear again if cached
  }
};