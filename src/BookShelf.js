import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BookItem from './BookItem'

class BookShelf extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    books: PropTypes.array.isRequired,
    moveToShelf: PropTypes.func.isRequired
  }

  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.name}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.books.length? this.props.books.map((book) => (
                <BookItem
                  key={book.id}
                  book={book}
                  moveToShelf={this.props.moveToShelf}
                />
            )): (<span>Nothing in shelf!</span>)}
          </ol>
        </div>
      </div>
    )
  }
}

export default BookShelf
