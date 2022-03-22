// ! html element
const renderDiv = document.querySelector('#staff_data_list');
const form = document.querySelector('#staff_add_form');
const modalBody = document.querySelector('.modal-body');

// ! app class
class App {
  constructor() {
    this._renderHtml();
    form.addEventListener('submit', this._getFormData);
    renderDiv.addEventListener('click', this._actionsWithDevdata);
  }

  // ! form input validation
  _validataForm = (...fields) => {
    const emptyResult = fields.some((el) => el === '');
    const undefinedResult = fields.some((el) => el === undefined);

    if (emptyResult || undefinedResult) {
      return false;
    } else {
      return true;
    }
  };

  // ! check local storage if there is any data
  _checkLocalStorage = (key) => {
    const localData = localStorage.getItem(key);
    return localData;
  };

  // ! show alert
  _showAlert = (message) => {
    alert(message);
  };

  // ! set data to the localStorage
  _setData = (key, data) => {
    let devData = [];
    const result = Array.isArray(data);
    if (result) {
      devData = data;
    } else {
      if (this._checkLocalStorage('devData')) {
        devData = JSON.parse(this._checkLocalStorage('devData'));
      }
      devData.push(data);
    }

    localStorage.setItem(key, JSON.stringify(devData));
  };

  // ! get data from localstorage
  _getData = () => {
    const devData = this._checkLocalStorage('devData');
    if (devData) {
      return JSON.parse(devData);
    } else {
      return [];
    }
  };

  // ! get data from the form
  _getFormData = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // ! set develper photo
    let { name, cell, gender, location } = data;
    data.photo = data.photo === '' ? './img/default-avatar.png' : data.photo;

    // ! validate form input
    const validateResult = this._validataForm(name, cell, location, gender);

    // ! finally set data to the localstorage
    if (validateResult) {
      this._setData('devData', data);
    } else {
      this._showAlert('All fileds are required');
    }

    // ! reset form
    form.reset();

    // ! call render html data
    this._renderHtml();
  };

  // ! show modal
  _showModal = (viewIndex) => {
    modalBody.innerHTML = '';
    const allDevData = this._getData();
    const devData = allDevData[viewIndex * 1];

    const modal = `  <div class="modalExtra">
    <img class="view__img" src="${devData.photo}" alt="" />
    <p>${devData.name}</p>
    <p>${devData.cell}</p>
    <p>${devData.gender}</p>
    <p>${devData.location}</p>
  </div>`;

    modalBody.insertAdjacentHTML('beforeend', modal);
  };

  // ! delete dev Data
  _deleteDevData = (deleteIndex) => {
    const allDevData = this._getData();
    allDevData.splice(deleteIndex, 1);
    this._setData('devData', allDevData);
    this._renderHtml();
  };

  // ! modal data
  _editDevData = (e) => {
    e.preventDefault();

    const formIndex = e.target.getAttribute('edit-form');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const { gender } = data;
    const validateResult = this._validataForm(gender);
    if (validateResult) {
      data.photo = data.photo === '' ? './img/default-avatar.png' : data.photo;

      const allDevData = this._getData();
      allDevData.splice(formIndex, 1, data);
      this._setData('devData', allDevData);
      this._renderHtml();
    } else {
      this._showAlert('Please select your gender');
    }
  };

  // ! show edit modal
  _showEditModal = (editIndex) => {
    modalBody.innerHTML = '';
    const allDevData = this._getData();
    const editData = allDevData[editIndex * 1];
    const maleCheck = editData.gender === 'Male';
    const femaleCheck = editData.gender === 'Female';

    const formHtml = `<form id="staff_edit_form" method="POST" edit-form="${editIndex}">
    <div class="my-3">
      <label for="">Name</label>
      <input class="form-control"  name="name" type="text" value="${
        editData.name
      }" placeholder="" />
    </div>
    <div class="my-3">
      <label for="">Cell</label>
      <input class="form-control" value="${
        editData.cell
      }" name="cell" type="text" placeholder="" />
    </div>
    <div class="my-3">
      <label for=""><strong>Gender</strong></label>
      <br />
      <input name="gender" class="male" ${
        maleCheck ? 'checked' : ''
      } type="radio" value="Male" /><label
        for="Male"
        >Male</label
      ><br />
      <input name="gender" class="female" ${
        femaleCheck ? 'checked' : ''
      } type="radio" value="Female" /><label
        for="Female"
        >Female</label
      >
    </div>
    <div class="my-3">
      <label for="">Location</label>
      <input class="form-control" value="${
        editData.location
      }" name="location" type="text" placeholder="" />
    </div>
    <div class="my-3">
      <label for="">Photo</label>
      <input class="form-control" value="${
        editData.photo
      }" name="photo" type="text" placeholder="" />
    </div>
    <div class="my-3">
      <input class="btn btn-primary w-100" data-bs-dismiss="modal" type="submit" value="Edit Data" />
    </div>
  </form>`;

    modalBody.insertAdjacentHTML('afterbegin', formHtml);

    const modalForm = document.querySelector('#staff_edit_form');
    modalForm.addEventListener('submit', this._editDevData);
  };

  // ! action dev data
  _actionsWithDevdata = (e) => {
    e.preventDefault();
    const viewBtn = e.target.closest('.view');
    const deleteBtn = e.target.closest('.delete');
    const editBtn = e.target.closest('.edit');

    if (viewBtn) {
      const viewIndex = viewBtn.getAttribute('set-view');
      this._showModal(viewIndex);
    }

    if (deleteBtn) {
      const deleteIndex = deleteBtn.getAttribute('set-delete');
      this._deleteDevData(deleteIndex);
    }

    if (editBtn) {
      const editIndex = editBtn.getAttribute('set-edit');
      this._showEditModal(editIndex);
    }
  };

  // ! render html to the DOM
  _renderHtml = () => {
    renderDiv.innerHTML = '';
    const devDataArr = this._getData();

    let html = '';
    devDataArr.map((data, index) => {
      html += `<tr class="text-center">
        <td>${index + 1}</td>
        <td>${data.name}</td>
        <td>${data.cell}</td>
        <td>${data.gender}</td>
        <td>${data.location}</td>
        <td>
          <img
            style="width: 30px; height: 30px; object-fit: cover"
            src="${data.photo}"
            alt=""
          />
        </td>
        <td>
          <button class="btn btn-info btn-sm view" data-bs-toggle="modal" data-bs-target="#staticBackdrop" set-view="${index}">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-warning btn-sm edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop" set-edit="${index}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm delete" set-delete="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>`;
    });

    renderDiv.insertAdjacentHTML('beforeend', html);
  };
}

const app = new App();
