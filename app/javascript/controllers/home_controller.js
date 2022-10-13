import { Controller } from "@hotwired/stimulus";
export default class extends Controller {
  static targets = [
    "firstName",
    "lastName",
    "nickName",
    "email",
    "phone",
    "employer",
    "dateStarted",
    "dateEnded",
    "firstNameAlert",
    "lastNameAlert",
    "emailAlert",
    "header",
    "disabledBtn",
    "saveBtn",
    "heading",
    "successMsg",
    "usersData",
    "personalDataModal",
    "employmentForm",
    "tRow",
    "userDataTable",
  ];
  initilize() {
    this.personalData = {};
    this.employerData = {};
    this.id = "";
    this.userData = {};
  }

  async loadUser() {
    this.baseUrl = `http://127.0.0.1:3000/users`;
    this.apiHeader = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };
    try {
      let res = await fetch(`${this.baseUrl}`, {
        method: "GET",
        headers: this.apiHeader,
      });
      let users = await res.json();
      this.userData = users;
      console.log(users?.length)
      if(users?.length!==0){this.showTable(users);} 
    } catch (error) {
      console.log(error);
    }
  }

  connect() {
    this.loadUser();
  }

  launchModal() {
    document.body.classList.add(`modal-open`);
    document.body.setAttribute(
      "style",
      "overflow: hidden; padding-right: 0px;"
    );
    this.personalDataModalTarget.style.display = "block";
    this.userDataTableTarget.style.overflow = "hidden";
    this.tRowTarget.style.position = "initial";
  }

  closeModal() {
    this.personalDataModalTarget.style.display = "none";
    this.tRowTarget.style.position = "sticky";
    this.userDataTableTarget.style.overflow = "auto";
    document.body.classList.remove("modal-open");
    document.body.removeAttribute("style");
    document.body.classList.remove("show");
  }

  openEmplyModal() {
    this.tRowTarget.style.position = "initial";
    document.body.classList.add(`modal-open`);
    this.userDataTableTarget.style.overflow = "hidden";
    this.personalDataModalTarget.removeAttribute("data-action");
    document.body.setAttribute(
      "style",
      "overflow: hidden; padding-right: 0px;"
    );
    this.employmentFormTarget.style.display = "block";
  }

  closeEmplyModal() {
    this.employmentFormTarget.style.display = "none";
    this.tRowTarget.style.position = "sticky";
    this.userDataTableTarget.style.overflow = "auto";
    document.body.classList.remove("modal-open");
    document.body.removeAttribute("style");
    document.body.classList.remove("show");
  }

  phoneFormat(input) {
    input = input.replace(/\D/g, "");
    input = input.substring(0, 10);
    var size = input.length;
    if (size == 0) {
      input = input;
    } else if (size < 4) {
      input = +input;
    } else if (size < 7) {
      input = input.substring(0, 3) + "-" + input.substring(3, 6);
    } else {
      input =
        input.substring(0, 3) +
        "-" +
        input.substring(3, 6) +
        "-" +
        input.substring(6, 10);
    }
    return input;
  }

  convertDateFormat = (dateString) => {
    const [month, day, year] = dateString.split("/");
    return [day, month, year].join("/");
  };

  handleFirstName() {
    this.headerTarget.innerHTML = `<p></p>`;
    this.firstNameTarget?.value?.length >= 25
      ? (this.firstNameAlertTarget.style.display = "block")
      : (this.firstNameAlertTarget.style.display = "none");
  }

  handleLastName() {
    this.headerTarget.innerHTML = `<p></p>`;
    this.lastNameTarget?.value?.length >= 50
      ? (this.lastNameAlertTarget.style.display = "block")
      : (this.lastNameAlertTarget.style.display = "none");
  }

  handleEmail() {
    this.headerTarget.innerHTML = `<p></p>`;
    !/.+@.+\.[A-Za-z]+$/.test(this.emailTarget?.value)
      ? (this.emailAlertTarget.style.display = "block")
      : (this.emailAlertTarget.style.display = "none");
  }

  handlePhoneNumber() {
    this.headerTarget.innerHTML = `<p></p>`;
    const phone = document.getElementById("phone");
    phone.value = this.phoneFormat(this.phoneTarget.value);
  }

  handleChange() {
    this.headerTarget.innerHTML = `<p></p>`;
    this.personalData = {
      user: {
        first_name: this.firstNameTarget?.value,
        last_name: this.lastNameTarget?.value,
        nickname: this.nickNameTarget?.value,
        email: this.emailTarget?.value,
        phone_number: this.phoneTarget.value,
      },
    };
  }

  async handleSave() {
    if (
      this.personalData?.user?.first_name === "" ||
      this.personalData?.user?.first_name.length >= 25 ||
      this.personalData?.user?.last_name.length >= 50 ||
      this.personalData?.user?.last_name === "" ||
      this.personalData?.user?.phone_number === "" ||
      this.personalData === undefined ||
      !/.+@.+\.[A-Za-z]+$/.test(this.emailTarget?.value)
    ) {
      this.headerTarget.innerHTML = `<p style="color:red;">Please fill all details</p>`;
    } else {
      this.headerTarget.innerHTML = `<p></p>`;
      try {
        let res = await fetch(`${this.baseUrl}`, {
          method: "POST",
          headers: this.apiHeader,
          body: JSON.stringify(this.personalData),
        });
        let data = await res.json();
        this.id = data.id;
        if (res?.status === 201) {
          this.userData = [...this.userData, data];
          this.showTable(this.userData);
          this.closeModal();
          this.openEmplyModal();
          this.personalData = {};
          this.firstNameTarget.value = "";
          this.lastNameTarget.value = "";
          this.nickNameTarget.value = "";
          this.emailTarget.value = "";
          this.phoneTarget.value = "";
        }
        if (res?.status === 400) {
          this.headerTarget.innerHTML = `<p style="color:red;">This email has already been taken</p>`;
          setTimeout(() => {
            this.headerTarget.innerHTML = `<p"></p>`;
          }, 1500);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  handleEmpChange() {
    if (
      this.employerTarget?.value === "" ||
      this.dateStartedTarget?.value === "" ||
      this.dateEndedTarget?.value === ""
    ) {
      this.disabledBtnTarget.style.display = "block";
      this.saveBtnTarget.style.display = "none";
      this.headingTarget.innerHTML = `<p style="color:red"></p>`;
    } else {
      this.disabledBtnTarget.style.display = "none";
      this.saveBtnTarget.style.display = "block";
      this.headingTarget.innerHTML = `<p></p>`;
      this.employerData = {
        employment: {
          employer_name: this.employerTarget?.value,
          start_date: this.convertDateFormat(this.dateStartedTarget?.value),
          end_date: this.convertDateFormat(this.dateEndedTarget?.value),
        },
      };
    }
  }

  async handleAddEmp() {
    if (
      this.employerTarget?.value === "" ||
      this.dateStartedTarget?.value === "" ||
      this.dateEndedTarget?.value === "" ||
      this.employerData === undefined
    ) {
      this.headingTarget.innerHTML = `<p style="color:red">Please fill all details</p>`;
    } else {
      try {
        let res = await fetch(`${this.baseUrl}/${this?.id}`, {
          method: "PUT",
          headers: this.apiHeader,
          body: JSON.stringify(this.employerData),
        });
        if (res?.status === 200) {
          this.employerTarget.value = "";
          this.dateStartedTarget.value = "";
          this.dateEndedTarget.value = "";
          this.successMsgTarget.style.display = "block";
          setTimeout(() => {
            this.successMsgTarget.style.display = "none";
          }, [2000]);
          this.employerData = {};
        }
      } catch (error) {
        console.log(error, "axios err");
      }
    }
  }

  async handleEmpSave() {
    if (
      this.employerTarget?.value === "" ||
      this.dateStarted?.value === "" ||
      this.dateEnded?.value === "" ||
      this.employerData === undefined
    ) {
      this.headingTarget.innerHTML = `<p style="color:red">Please fill all details</p>`;
    } else {
      this.saveBtnTarget.style.display = "block";
      this.headingTarget.innerHTML = "<p></p>";
      this.disabledBtnTarget.style.display = "none";
      try {
        let res = await fetch(`${this.baseUrl}/${this?.id}`, {
          method: "PUT",
          headers: this.apiHeader,
          body: JSON.stringify(this.employerData),
        });
        if (res?.status === 200) {
          setTimeout(() => {
            this.headerTarget.innerHTML = `<p></p>`;
          }, [1000]);
          this.employerTarget.value = "";
          this.dateStartedTarget.value = "";
          this.dateEndedTarget.value = "";
          this.closeEmplyModal();
          this.employerData = {};
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  showTable(data) {
    let tab = `<tr data-home-target="tRow" style="position: sticky;top: 0;background: white;">
          <th>Id</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Nick Name</th>
          <th>Email</th>
          <th>Phone Number</th>
         </tr>`;
    for (let user of data) {
      tab += `<tr>
    <td>${user.id}</td>
    <td>${user.first_name}</td>
    <td>${user.last_name}</td>
    <td>${user.nickname}</td>
    <td>${user.email}</td>
    <td>${user.phone_number}</td></tr>`;
    }
    this.usersDataTarget.innerHTML = tab;
  }
}
