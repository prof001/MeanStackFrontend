import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {Post} from '../post.model';
import {PostService} from '../post.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading  = false;
  totalPosts = 10;
  currentPage = 1;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  constructor(public postService: PostService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postService.getPostUpdateListener().subscribe(
      posts => {
        this.isLoading = false;
        this.posts = posts;
      }
    );
  }

  onDelete(postId: number) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(
      () => {
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      }
    );
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage =  pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

}
