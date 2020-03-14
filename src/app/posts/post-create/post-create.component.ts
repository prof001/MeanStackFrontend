import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Post} from '../post.model';
import {NgForm} from '@angular/forms';
import {PostService} from '../post.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

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

  constructor(public postService: PostService,
              public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.post = this.postService.getPost(this.postId);
        this.isLoading = false;
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content);
    } else {
      this.postService.updatePost(+this.postId, form.value.title, form.value.content);
    }
    form.resetForm();
  }

}
