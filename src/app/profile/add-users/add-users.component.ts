import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsersModel } from '../shared/models/add-users.model';
import { AddUsersService } from '../shared/services/add-users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
  addUsersForm: FormGroup;
  addUsersModel: UsersModel;

  userCreate: boolean;

  loadingSpinner: string = 'loading';
  noUsers: boolean = false;

  userId: string;

  usersList: any[] = [];

  states: any[] = [];
  cities: any[] = [];

  selectedUser: string;

  isPasswordShow: boolean = false;

  constructor(
    private modalService: NgbModal,
    private addUsersService: AddUsersService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.getUsers();

    this.addUsersService.getStates()
      .subscribe(states => {
        this.states = states.states;
      });

    this.addUsersModel = new UsersModel();

    this.addUsersForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      givenName: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      stateId: new FormControl(null),
      cityId: new FormControl(null),
      postalCode:  new FormControl(null, Validators.required),
      passwords: new FormGroup({
        password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
        confirm: new FormControl(null)
      }, { validators: this.checkPasswords }),
    });
  }

  ngAfterViewInit() {    
    document.querySelectorAll("ng-select input").forEach(function(el) {
      el.setAttribute("autocomplete", "chrome-off")
    })
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): any => {
    let pass = group.get('passwords.password')?.value;
    let conf = group.get('passwords.confirm')?.value;
    if (pass === conf) {
      return;
    } else {
      return { invalid: true }
    }
  }

  togglePassword() {
    this.isPasswordShow = !this.isPasswordShow;
  }

  getUsers() {
    this.spinner.show('loading');
    this.addUsersService.getUsers()
      .subscribe(users => {
        this.usersList = users;
        this.spinner.hide('loading');
        if(this.usersList.length == 0) {
          this.noUsers = true;
        } else {
          this.noUsers = false;
        }
      });
  }

  selectState(e: any) {
    let stateIds: any = [];
    stateIds.push(e.id);
    this.addUsersService.getCities(stateIds)
      .subscribe(data => {
        this.cities = data.cities;
      });
  }

  addUsers(users: any) {
    this.addUsersForm.reset();
    this.userCreate = true;
    this.modalService.open(users, { centered: true, windowClass: 'add-users' });
  }

  addUser() {
    if (!this.addUsersForm.valid) {
      this.addUsersForm.markAllAsTouched();
      return;
    }
    let password = this.addUsersForm.value.passwords.password;
    delete this.addUsersForm.value.passwords;

    let userForm = { ...this.addUsersForm.value , password }

    this.addUsersService.addUsers(userForm)
      .subscribe(res => {
        this.addUsersForm.reset();
        this.modalService.dismissAll();
        this.getUsers();
      });
  }

  openUpdateUserModal(users: any, id: number) {
    this.addUsersForm.reset();
    this.userCreate = false;
    Object.values(this.usersList).forEach((user: any) => {
      if(user.id == id) {
        this.selectedUser = user.id;
        this.addUsersForm.patchValue({
          postalCode: user.postalCode,
          givenName: user.givenName,
          surname: user.surname,
          stateId: user.stateId
        });
        let stateIds: any = [];
        stateIds.push(user.stateId);
        this.addUsersService.getCities(stateIds)
          .subscribe(data => {
            this.cities = data.cities;
            this.addUsersForm.patchValue({
              cityId: user.cityId
            });
          });
      }
    });

    this.modalService.open(users, { centered: true, windowClass: 'add-users' });
  }

  updateUser() {
    const id = this.selectedUser;
    delete this.addUsersForm.value.passwords;
    delete this.addUsersForm.value.email;

    let userForm = { ...this.addUsersForm.value, id }

    this.addUsersService.updateUsers(userForm)
      .subscribe(res => {
        this.addUsersForm.reset();
        this.modalService.dismissAll();
        this.getUsers();
      });
  }

  deleteUser(id: string) {
    Swal.fire({
      title: 'Are you sure want to delete?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ff5f5f',
      cancelButtonColor: '#CECECE',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.addUsersService.deleteUsers(id)
          .subscribe(del => {
            this.getUsers();
            Swal.fire(
              'Completed!',
              'successfully deleted.'
            );
          });
      }
    });
  }
}
