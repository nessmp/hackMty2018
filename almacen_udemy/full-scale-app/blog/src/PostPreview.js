import React, { Component } from 'react';

class PostPreview extends Component {
  render(){
    return(
      <div className="post-preview">
        <a href="post.html">
          <h2 className="post-title">
            Failure is not an option
          </h2>
          <h3 className="post-subtitle">
            Many say exploration is part of our destiny, but it’s actually our duty to future generations.
          </h3>
        </a>
        <p className="post-meta">Posted by
          <a href="#">Start Bootstrap</a>
          on July 8, 2018</p>
      </div>
    );
  }
}

export default PostPreview;
