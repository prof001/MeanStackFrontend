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

  getPosts() {
    this.http.get<Post[]>('http://localhost:3000/api/v1/posts')
      .subscribe(
        postData => {
          // console.log(postData);
          this.posts = postData;
          this.postsUpdated.next([...this.posts]);
        },
        err => {
          console.log(err);
        }
      );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post('http://localhost:3000/api/v1/posts/addPost', postData)
      .subscribe(
        responseData => {

          const post: Post = {
            // @ts-ignore
            id: responseData.id,
            title,
            content
          };

          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
          this.router.navigate(['/']);
        },
        err => {
          console.log(err);
        }
      );
  }

  deletePost(postId: number) {
    this.http.delete(`http://localhost:3000/api/v1/posts/deletePost/${postId}`)
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // TODO Make this get post from the server
  getPost(id: string) {
    return {...this.posts.find(p => p.id === +id)};
  }

  updatePost(id: number, title: string, content: string) {
    const post: Post = {id, title, content};
    this.http.put(`http://localhost:3000/api/v1/posts/updatePost/${id}`, post)
      .subscribe(res => {
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  // (change)="onImagePicked($event)";
}
