import { Controller } from "@hotwired/stimulus";
export default class extends Controller {
  static targets = ["firstName", "lastName", "nickName", "email", "phone","employer","dateStarted","dateEnded"];
  initilize() {
    this.personalData = {};
    this.emailAlert = document.getElementById("alert4");
    this.employerData={};
  }
  launchModal() {
    console.log("click");
    const modal = document.getElementById("staticBackdrop");
    modal.style.display = "block";
  }

  closeModal() {
    const modals = document.getElementById("staticBackdrop");
    modals.style.display = "none";
  }

  openEmplyModal(){
    const modal= document.getElementById("employmentForm");
    modal.style.display="block"
  }

  closeEmplyModal(){
    const modal= document.getElementById("employmentForm");
    modal.style.display="none"
  }
   phoneFormat(input){
    input = input.replace(/\D/g,'');
    input = input.substring(0,10);
    var size = input.length;
    if(size == 0){
            input = input;
    }else if(size < 4){
            input = +input;
    }else if(size < 7){
            input = input.substring(0,3)+'-'+input.substring(3,6);
    }else{
            input = input.substring(0,3)+'-'+input.substring(3,6)+'-'+input.substring(6,10);
    }
    return input;
}

  handleChange() {
    const err = document.getElementById("alert1");
    const err1 = document.getElementById("alert2");
    const phone=document.getElementById("phone");
    this.emailAlert = document.getElementById("alert4");
    this.emailAlert.style.display = "none";
    phone.value=this.phoneFormat(this.phoneTarget.value);

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
    var cleaned = ('' + this.phoneTarget?.value).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      phoneNumberString= match[1] + '-' + match[2] + '-' + match[3]
    }
    this.personalData = {
      user:{firstName: this.firstNameTarget?.value,
      lastName: this.lastNameTarget?.value,
      nickName: this.nickNameTarget?.value,
      email: this.emailTarget?.value,
      phone: this.phoneTarget.value,}
    };
  }

  handleSave() {
    this.emailAlert = document.getElementById("alert4");
    if (!/.+@.+\.[A-Za-z]+$/.test(this.personalData?.email) === true) {
      this.emailAlert.style.display = "block";
    } else {
      this.emailAlert.style.display = "none";
    }
    this.closeModal();
    this.openEmplyModal()
  }

  handleEmpChange(){
  }
}
