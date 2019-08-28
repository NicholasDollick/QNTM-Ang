import { Component, OnInit, Input } from '@angular/core';
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

  constructor(public bsModalRef: BsModalRef, private auth: AuthService, private userService: UserService) { }

  ngOnInit() {
    if (this.auth.decodedToken === undefined) {
      this.auth.refreshToken();
    }
    this.testvar = false;
    console.log(this.user);
    this.name = this.user.username;
    this.photos = this.user.photos;
    console.log(this.user.photos);
    console.log(this.photos.length);
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
        this.photos.push(photo);
      }
    };
  }

  test() {
    this.testvar = !this.testvar;
  }

  onFileSelected() {
    this.uploader.uploadAll();
    // this.setMain(this.photos[this.photos.length - 1]);
  }

  setMain(photo: Photo) {
    if (this.auth.decodedToken === undefined) {
      this.auth.refreshToken();
    }
    this.userService.setMainPhoto(this.auth.decodedToken.nameid, photo.id).subscribe(res => {
      console.log('this works');
    });
  }

}
