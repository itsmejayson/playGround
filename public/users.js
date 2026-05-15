const checkAuth = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (!isLoggedIn) {
    window.location.replace('/no-access.html'); // ✅ redirect to custom page
    return;
  }

  // ✅ show page only if authorized
  document.body.style.display = 'block';
};

let dataTable;

const loadUsers = async () => {
  try {
    showSkeleton();
    const res = await fetch('/users');
    const users = await res.json();

    // ✅ destroy FIRST before changing DOM
    if ($.fn.DataTable.isDataTable('#usersTable')) {
      $('#usersTable').DataTable().destroy();
    }

    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';

    users.forEach(user => {
      const row = `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td class="text-end">

            <button class="btn btn-warning btn-sm me-2" onclick="updateUser('${user._id}')">
              <i class="bi bi-pencil"></i>
            </button>

            <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">
              <i class="bi bi-trash"></i>
            </button>

          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
    // ✅ reinitialize AFTER data is rendered
    dataTable = $('#usersTable').DataTable({
      responsive: true,
      pageLength: 5,
      lengthMenu: [5, 10, 20],
      destroy: true // extra safety
    });

  } catch (err) {
    console.error(err);
  }
};

const showSkeleton = () => {
  const tableBody = document.getElementById('userTableBody');

  tableBody.innerHTML = Array(5).fill(`
    <tr>
      <td><span class="placeholder col-6"></span></td>
      <td><span class="placeholder col-8"></span></td>
      <td class="text-end"><span class="placeholder col-4"></span></td>
    </tr>
  `).join('');
};

const deleteUser = async (id) => {
  try {
    const confirm = await Swal.fire({
      title: 'Delete user?',
      text: 'This cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete'
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`/users/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Delete failed');
    }

    Swal.fire('Deleted!', data.message, 'success');
    loadUsers();

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: 'error',
      title: 'Delete failed',
      text: error.message
    });
  }
};


const updateUser = async (id) => {
  try {
    const { value: formValues } = await Swal.fire({
      title: 'Update User',
      html: `
            <select id="column" class="form-select mb-2"
              onchange="
                const input = document.getElementById('value');
                input.value = '';

                if (this.value === 'email') {
                  input.type = 'email';
                  input.placeholder = 'Enter email';
                } else if (this.value === 'password') {
                  input.type = 'password';
                  input.placeholder = 'Enter password';
                } else {
                  input.type = 'text';
                  input.placeholder = 'Enter name';
                }
              ">
              
              <option value="" disabled selected>Select field</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
            </select>

        <input id="value" class="swal2-input" placeholder="Enter value">
      `,
      confirmButtonText: 'Update',

      didOpen: () => {
        // ✅ minimal style tweak
        const select = document.getElementById('column');
        select.style.cursor = 'pointer';
        select.style.padding = '10px';
        select.style.borderRadius = '8px';
      },

      preConfirm: () => {
        const columnName = document.getElementById('column').value;
        const columnValue = document.getElementById('value').value;

        if (!columnName || !columnValue) {
          Swal.showValidationMessage('Please fill all fields');
          return false;
        }

        return { columnName, columnValue };
      }
    });

    if (!formValues) return;

    const res = await fetch(`/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues)
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    Swal.fire('Updated!', data.message, 'success');
    loadUsers();

  } catch (error) {
    Swal.fire('Error', error.message, 'error');
  }
};


const createUser = async () => {
  try {
    const { value: formValues } = await Swal.fire({
      title: 'Create User',
      html:
        '<input id="name" class="swal2-input" placeholder="Name">' +
        '<input id="email" class="swal2-input" placeholder="Email">' +
        '<input id="password" type="password" class="swal2-input" placeholder="Password">',
      focusConfirm: false,
      preConfirm: () => {
        return {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value
        };
      }
    });

    if (!formValues) return;

    const res = await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Create failed');
    }

    Swal.fire('Created!', data.message, 'success');
    loadUsers();

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: 'error',
      title: 'Creation failed',
      text: error.message
    });
  }
};

const logout = async () => {
  try {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'You will need to login again',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444'
    });

    if (!result.isConfirmed) return;

    // ✅ Clear login state
    localStorage.removeItem('isLoggedIn');

    await Swal.fire({
      icon: 'success',
      title: 'Logged out',
      text: 'You have been logged out successfully',
      timer: 1200,
      showConfirmButton: false
    });

    // ✅ Redirect (no back history)
    window.location.replace('/');

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: 'error',
      title: 'Logout failed',
      text: error.message || 'Something went wrong'
    });
  }
};


window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

window.onload = () => {
  checkAuth();   // your existing auth
  loadLayout();  // ✅ NEW
  loadUsers();   // your users
};