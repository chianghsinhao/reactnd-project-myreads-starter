import React from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf'
import BookItem from './BookItem'

class BooksApp extends React.Component {
  state = {
    books: [],
    query: '',
    queryBooks: []
  }

  moveToShelf = (book, shelf) => {
    /* The book object may be shared by both shelf and query array
       For shelf books, there will be 3 cases
       1. remove from array if shelf is 'none' (first we need to set it)
       2. change shelf name (in case this is called from query)
       3. the book is new and need to add to array
    */
    book.shelf = shelf
    let newBooks
    if (shelf === 'none') {
      newBooks = this.state.books.filter(x => x.shelf !== 'none')
    }
    else {
      let bookInShelf = false
      newBooks = this.state.books.map(x => {
        if (x.id === book.id) {
          x.shelf = shelf
          bookInShelf = true
        }
        return x
      })
      if (!bookInShelf) {
        newBooks.push(book)
      }
    }

    /* We don't have to update queryBooks
       1. the select option will be correct after change
       2. when going from home page it will be re-rendered
    */
    this.setState({
      books: newBooks
      //queryBooks: newQueryBooks
    })

    BooksAPI.update(book, shelf)
  }

  updateQuery = (query) => {
    if (query.trim() !== '') {
      BooksAPI.search(query.trim()).then((data) => {
        if (data.error) {
          this.setState({
            queryBooks: [],
            query: query
          })
          return
        }
        // For books already on shelf, add shelf name
        data.forEach((book) => {
          let bookInShelf = this.state.books.find(x => x.id === book.id)
          if (bookInShelf) {
            book.shelf = bookInShelf.shelf
          }
        })
        this.setState({
          queryBooks: data,
          query: query
        })
      }).catch((err) => {
        console.log('query error', err)
        this.setState({
          queryBooks: [],
          query: query
        })
      })
    }
    else {
      this.setState({
        queryBooks: [],
        query:query
      })
    }
  }

  componentWillMount() {
    BooksAPI.getAll().then((data) => {
      this.setState({ books: data})
    })
  }

  render() {
    const {books, query, queryBooks} = this.state

    return (
      <div className="app">
        <Route path="/search" render={({ history }) => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link
                className="close-search"
                to="/"
              >Close</Link>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input
                  type="text"
                  value={query}
                  placeholder="Search by title or author"
                  onChange={(event) => { this.updateQuery(event.target.value)} }
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {queryBooks.length? queryBooks.map((book) => (
                  <BookItem
                    key={book.id}
                    book={book}
                    moveToShelf={this.moveToShelf}
                  />
              )): ''}
              </ol>
            </div>
          </div>
        )}/>
        <Route path="/" exact render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>My Book Shelf</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf
                  name="Currently Reading"
                  books={books.filter((book) => (book.shelf === 'currentlyReading'))}
                  moveToShelf={this.moveToShelf}
                />
                <BookShelf
                  name="Want To Read"
                  books={books.filter((book) => (book.shelf === 'wantToRead'))}
                  moveToShelf={this.moveToShelf}
                />
                <BookShelf
                  name="Read"
                  books={books.filter((book) => (book.shelf === 'read'))}
                  moveToShelf={this.moveToShelf}
                />
              </div>
            </div>
            <div className="open-search">
              <Link
                to="/search"
              >Add a book</Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp
