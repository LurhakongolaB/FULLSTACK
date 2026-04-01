const Header = ({ name }) => {
  console.log('Header component rendering with name:', name)
  return <h2>{name}</h2>
}

const Part = ({ part }) => {
  console.log('Part component rendering for:', part.name)
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  console.log('Content component received parts array:', parts)
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Total = ({ parts }) => {
  console.log('Total component calculating for parts:', parts)
  
  const total = parts.reduce((s, p) => {
    console.log('What is happening in reduce -> Current Sum:', s, 'Current Part:', p)
    return s + p.exercises
  }, 0)

  return <b>total of {total} exercises</b>
}

const Course = ({ course }) => {
  console.log('Course module received data:', course)
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course