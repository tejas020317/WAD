const API_URL = 'http://localhost:3000/user';

const userForm = document.getElementById('user-form');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const userList = document.getElementById('user-list');

// Load users on init
document.addEventListener('DOMContentLoaded', fetchUsers);

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('user-id').value;
    const userData = {
        email: document.getElementById('email').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
    };

    if(id) {
        await updateUser(id, userData);
    } else {
        await createUser(userData);
    }
});

cancelBtn.addEventListener('click', resetForm);

async function fetchUsers() {
    try {
        const res = await fetch(API_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        renderTable(data);
    } catch (err) {
        console.error('Error fetching users:', err);
    }
}

function renderTable(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        
        // Truncate ID for cleaner display
        const displayId = user._id ? user._id.substring(user._id.length - 6) : 'N/A';
        
        row.innerHTML = `
            <td><span class="id-col">...${displayId}</span></td>
            <td>${user.email}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.phone}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-sm btn-edit" onclick="editUser('${user._id}')" title="Edit">
                        <i class="fas fa-pen"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteUser('${user._id}')" title="Delete">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        userList.appendChild(row);
    });
}

async function createUser(userData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create user');
        }
        
        resetForm();
        fetchUsers();
    } catch (err) {
        alert("Error: " + err.message);
        console.error('Error creating user', err);
    }
}

async function deleteUser(id) {
    if(!confirm("Are you sure you want to delete this user?")) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete user');
        }
        fetchUsers();
    } catch (err) {
        alert("Error: " + err.message);
        console.error('Error deleting user', err);
    }
}

async function editUser(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const user = await res.json();
        
        document.getElementById('user-id').value = user._id;
        document.getElementById('email').value = user.email;
        document.getElementById('firstName').value = user.firstName;
        document.getElementById('lastName').value = user.lastName;
        document.getElementById('phone').value = user.phone;
        
        formTitle.innerHTML = '<i class="fas fa-user-edit"></i> Update User';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        cancelBtn.style.display = "flex";
        
        // Scroll back to the top form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        console.error('Error fetching user', err);
    }
}

async function updateUser(id, userData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update user');
        }
        
        resetForm();
        fetchUsers();
    } catch (err) {
        alert("Error: " + err.message);
        console.error('Error updating user', err);
    }
}

function resetForm() {
    userForm.reset();
    document.getElementById('user-id').value = '';
    formTitle.innerHTML = '<i class="fas fa-user-plus"></i> Register User';
    submitBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Create User';
    cancelBtn.style.display = "none";
}
