import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Post} from '../post.model';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {PostService} from '../post.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {mimeType} from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  postId: string;
  post: Post = new Post();
  isLoading = false;
  form: FormGroup;
  imagePreview: string | ArrayBuffer;

  constructor(public postService: PostService,
              public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null,
        {validators: [Validators.required]}),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        // TODO Add subscribe to this
        this.getPost(this.postId);
        this.isLoading = false;
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  getPost(id: string) {
    this.postService.getPost(id).subscribe(
      res => {
        this.post = {
          id: res.id,
          title: res.title,
          content: res.content,
          imagePath: res.imagePath
        };

        this.form.setValue({
          title: this.post.title,
          content: this.post.content,
          image: this.post.imagePath
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
    } else {
      this.postService.updatePost(
        +this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
