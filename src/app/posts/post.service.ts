import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) { }

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

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title,
      content
    };
    this.http.post('http://localhost:3000/api/v1/posts/addPost', post)
      .subscribe(
        responseData => {
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
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
}
