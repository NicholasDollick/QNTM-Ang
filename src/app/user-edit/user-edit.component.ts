import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { FileUploader } from 'ng2-file-upload';
import { AuthService } from '../_services/auth.service';
import { environment } from 'src/environments/environment';
import { Photo } from '../_models/photo';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: User;
  closeBtnName: string;
  title: string;
  testvar = false;
  uploader: FileUploader;
  baseUrl = environment.apiUrl;
  photos: Photo[];
  name: string;
  photoUrl: string;
  currentMain: Photo;
  @Output() getUserPhotoChange = new EventEmitter<string>();

  constructor(public bsModalRef: BsModalRef, private auth: AuthService,
    private userService: UserService) { }

  ngOnInit() {
    if (this.auth.decodedToken === undefined) {
      this.auth.refreshToken();
    }
    this.auth.photoUrl.subscribe(url => this.photoUrl = url);
    this.testvar = false;
    this.name = this.user.username;
    this.photos = this.user.photos;
    this.initializeUploader();
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.auth.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + this.auth.getToken(),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onSuccessItem = (item, response, status, headers)  => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          isMain: res.isMain,
          description: res.description,
        };
        this.setMain(photo);
        this.user.photoUrl = photo.url;
        this.auth.changeUserPhoto(photo.url);
      }
    };
  }

  test() {
    this.testvar = !this.testvar;
  }

  onFileSelected() {
    this.uploader.uploadAll();
  }

  setMain(photo: Photo) {
    if (this.auth.decodedToken === undefined) {
      this.auth.refreshToken();
    }
    this.userService.setMainPhoto(this.auth.decodedToken.nameid, photo.id).subscribe(res => {
      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain = false;
      photo.isMain = true;
      this.getUserPhotoChange.emit(photo.url);
      this.updateUserPhoto(photo.url);
    });
  }

  updateUserPhoto(newUrl: string) {
    if (localStorage.getItem('user') === null) {
      const user = JSON.parse(sessionStorage.getItem('user'));
      user['user']['photoUrl'] = newUrl;
      sessionStorage.setItem('user', JSON.stringify(user));
   } else {
     const user = JSON.parse(localStorage.getItem('user'));
     user['user']['photoUrl'] = newUrl;
     localStorage.setItem('user', JSON.stringify(user));
   }
  }

}
