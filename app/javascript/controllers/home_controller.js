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
  ];
  initilize() {
    this.personalData = {};
    this.emailAlert = document.getElementById("alert4");
    this.employerData = {};
    this.id = "";
    (this.saveBtn = ""), (this.addBtn = "");
  }
//   $(function(){
//     $("#datepicker").datepicker({
//         dateFormat: "mm/dd/yy"
//     });
// });
  launchModal() {
    const modal = document.getElementById("staticBackdrop");
    modal.style.display = "block";
  }

  closeModal() {
    const modals = document.getElementById("staticBackdrop");
    modals.style.display = "none";
  }

  openEmplyModal() {
    const modal = document.getElementById("employmentForm");
    modal.style.display = "block";
  }

  closeEmplyModal() {
    const modal = document.getElementById("employmentForm");
    modal.style.display = "none";
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
    const [month, day, year] = dateString.split('/');
    return  [day, month, year].join('/');
  };

  handleChange() {
    const err = document.getElementById("alert1");
    const err1 = document.getElementById("alert2");
    const phone = document.getElementById("phone");
    const header = document.getElementById("header");
    this.emailAlert = document.getElementById("alert4");
    this.emailAlert.style.display = "none";
    phone.value = this.phoneFormat(this.phoneTarget.value);
    header.innerHTML = "<p><p>";
    if (this.firstNameTarget?.value?.length >= 25) {
      err.style.display = "block";
    } else {
      err.style.display = "none";
    }
    if (this.lastNameTarget?.value.length >= 50) {
      err1.style.display = "block";
    } else {
      err1.style.display = "none";
    }
    var cleaned = ("" + this.phoneTarget?.value).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      let phoneNumberString = match[1] + "-" + match[2] + "-" + match[3];
    }
    this.personalData = {
      user: {
        first_name: this.firstNameTarget?.value,
        last_name: this.lastNameTarget?.value,
        nickname: this.nickNameTarget?.value,
        email: this.emailTarget?.value,
        phone_number: this.phoneTarget.value,
      },
    };
    console.log(this.phoneTarget?.value?.length,'value')
  }

  async handleSave() {
    this.emailAlert = document.getElementById("alert4");
    const header = document.getElementById("header");
    if (
      this.personalData?.user?.first_name === "" ||this.personalData?.user?.first_name.length >=25 ||this.personalData?.user?.last_name.length >=50 ||
      this.personalData?.user?.last_name === "" ||
      this.personalData?.user?.phone_number === "" ||
      this.personalData === undefined
    ) {
      header.innerHTML = `<p style="color:red;">please fill all details</p>`;
    } else if (!/.+@.+\.[A-Za-z]+$/.test(this.personalData?.user.email)) {
      this.emailAlert.style.display = "block";
    } else {
      this.emailAlert.style.display = "none";
      try {
        let res = await fetch("http://127.0.0.1:3000/users", {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.personalData),
        });
        let data = await res.json();
        this.id = data.id;
        if (res?.status === 201) {
          header.innerHTML = `<p style="color:red;">email has already been taken</p>`;
          this.closeModal();
          this.openEmplyModal();
          this.personalData = {};
          document.getElementById("firstName").value = "";
          document.getElementById("lastName").value = "";
          document.getElementById("nickName").value = "";
          document.getElementById("email").value = "";
          document.getElementById("phone").value = "";
        }
      } catch (error) {
        console.log(error, "axios err");
      }
    }
  }

  handleEmpChange() {
    if (
      this.employerTarget?.value === "" ||
      this.dateStartedTarget?.value === "" ||
      this.dateEndedTarget?.value === ""
    ) {
      console.log(this.dateStartedTarget?.value,'data')
      const emplyHeading = document.getElementById("heading");
      emplyHeading.innerHTML = `<p style="color:red"></p>`;
    } else {
      const emplyHeading = document.getElementById("heading");
      const disBtn = document.getElementById("disabledBtn");
      this.saveBtn = document.getElementById("saveBtn");
      disBtn.style.display = "none";
      this.saveBtn.style.display = "block";
      emplyHeading.innerHTML = `<p></p>`;
      this.employerData = {
        employment: {
          employer_name: this.employerTarget?.value,
          start_date:this.convertDateFormat(this.dateStartedTarget?.value),
          end_date:this.convertDateFormat(this.dateEndedTarget?.value),
        },
      };
    }
    console.log(this.employerData?.employment,'data')
  }

  async handleAddEmp() {
    const emplyHeading = document.getElementById("heading");
    if (
      this.employerTarget?.value === "" ||
      this.dateStarted?.value === "" ||
      this.dateEnded?.value === "" ||
      this.employerData === undefined
    ) {
      emplyHeading.innerHTML = `<p style="color:red">Please fill all details</p>`;
    } else {
      try {
        let res = await fetch(`http://127.0.0.1:3000/users/${this?.id}`, {
          method: "PUT",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.employerData),
        });
        if (res?.status === 200) {
          let successMsg = document.getElementById("successMsg");
          document.getElementById("employer").value = "";
          document.getElementById("startDate").value = "";
          document.getElementById("endDate").value = "";
          successMsg.style.display = "block";
          setTimeout(() => {
            successMsg.style.display = "none";
          }, [2000]);
          header.innerHTML = `<p style="color:red;">email has already been taken</p>`;
          this.employerData = {};
        }
      } catch (error) {
        console.log(error, "axios err");
      }
    }
  }

  async handleEmpSave() {
    const emplyHeading = document.getElementById("heading");
    if (
      this.employerTarget?.value === "" ||
      this.dateStarted?.value === "" ||
      this.dateEnded?.value === "" ||
      this.employerData === undefined
    ) {
      emplyHeading.innerHTML = `<p style="color:red">Please fill all details</p>`;
    } else {
      this.saveBtn.style.display = "block";
      emplyHeading.innerHTML = "<p></p>";
      const disabledBtn = document.getElementById("disabledBtn");
      disabledBtn.style.display = "none";
      try {
        let res = await fetch(`http://127.0.0.1:3000/users/${this?.id}`, {
          method: "PUT",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.employerData),
        });
        let data = await res.json();
        if (res?.status === 200) {
          header.innerHTML = `<p style="color:red;">email has already been taken</p>`;
          setTimeout(() => {
            header.innerHTML = `<p style="color:red;"></p>`;
          }, [1000]);
          document.getElementById("employer").value = "";
          document.getElementById("startDate").value = "";
          document.getElementById("endDate").value = "";
          this.closeEmplyModal();
          this.personalData = {};
          const card = `<h1></h1>`;
          try {
            let res = await fetch("http://127.0.0.1:3000/users", {
              method: "GET",
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
              },
            });
            let users = await res.json();
            this.show(users);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error, "axios err");
      }
    }
  }
  show(data) {
    let tab = `<tr>
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
    <td>${user.phone_number}</td>
</tr>`;
    }
    document.getElementById("employees").innerHTML = tab;
  }
}
