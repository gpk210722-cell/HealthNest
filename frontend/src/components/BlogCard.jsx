import { Link } from "react-router-dom";

function BlogCard({ blog }) {
    return (
        <article className="blog-card">

            {/* Blog Image */}
            <div className="blog-image">
                {blog.image}
            </div>

            {/* Category */}
            <span>{blog.category}</span>

            {/* Title */}
            <h3>{blog.title}</h3>

            {/* Description */}
            <p>{blog.description}</p>

            {/* Read More */}
            <Link to={`/blogs/${blog.id}`}>
                <button>
                    Read Article →
                </button>
            </Link>

        </article>
    );
}

export default BlogCard;