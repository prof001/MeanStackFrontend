import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http.get<Post[]>(`http://localhost:3000/api/v1/posts${queryParams}`)
      .subscribe(
        postData => {
          console.log(postData);
          this.posts = postData;
          this.postsUpdated.next([...this.posts]);
        },
        err => {
          console.log(err);
        }
      );
  }

  getPost(id: string) {
    return this.http.get<Post>(`http://localhost:3000/api/v1/posts/${id}`);
    // return {...this.posts.find(p => p.id === +id)};
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<Post>('http://localhost:3000/api/v1/posts/addPost', postData)
      .subscribe(
        responseData => {
          this.router.navigate(['/']);
        },
        err => {
          console.log(err);
        }
      );
  }

  deletePost(postId: number) {
    return this.http.delete(`http://localhost:3000/api/v1/posts/deletePost/${postId}`);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  updatePost(id: number, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {id, title, content, imagePath: image};
    }
    this.http.put(`http://localhost:3000/api/v1/posts/updatePost/${id}`, postData)
      .subscribe(res => {
        this.router.navigate(['/']);
      });
  }

  // (change)="onImagePicked($event)";
}
