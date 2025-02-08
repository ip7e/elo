const books = [
  {
    author: "Author 1",
    name: "Book 1",
  },
  //...
]

function Demo() {
  return <TypedList items={books} renderItem={(book) => <div>{book.author}</div>} />
}

type ListProps<T> = {
  items: T[]
  renderItem: (item: T) => JSX.Element
}

function TypedList<T>(props: ListProps<T>) {
  return <>{props.items.map(props.renderItem)}</>
}
