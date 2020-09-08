import React, { useState, useEffect } from "react";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "easymde/dist/easymde.min.css";
import { firestore } from "./utils/database";
import { Container, Button, Card, ButtonGroup } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export default function App() {
  const [category, setCategory] = useState(undefined);
  const [posts, setPosts] = useState([]);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [BegginingReached, setBeginningReached] = useState(false);

  useEffect(() => {
    setReachedEnd(false);
    setBeginningReached(false);

    let query = category
      ? firestore.collection("blog-posts").where("category", "==", category)
      : firestore.collection("blog-posts");

    query
      .orderBy("date", "desc")
      .limit(3)
      .get()
      .then((data) => {
        setPosts(data.docs);
        if (data.docs.length < 3) setReachedEnd(true);
      });
  }, [category]);

  function showNextPage() {
    setReachedEnd(false);
    setBeginningReached(false);
    let query = category
      ? firestore.collection("blog-posts").where("category", "==", category)
      : firestore.collection("blog-posts");

    query
      .orderBy("date", "desc")
      .startAfter(posts[posts.length - 1].data().date)
      .limit(3)
      .get()
      .then((data) => {
        if (data.docs.length > 0) setPosts(data.docs);
        else if (data.docs.length < 3) setReachedEnd(true);
      });
  }

  function showPrevPage() {
    setReachedEnd(false);
    setBeginningReached(false);
    let query = category
      ? firestore.collection("blog-posts").where("category", "==", category)
      : firestore.collection("blog-posts");
    query
      .orderBy("date", "desc")
      .endBefore(posts[0].data().date)
      .limit(3)
      .get()
      .then((data) => {
        if (data.docs.length === 0) setBeginningReached(true);
        if (data.docs.length > 0) setPosts(data.docs);
        else if (data.docs.length < 3) setBeginningReached(true);
      });
  }
  return (
    <Container className="App">
      <h1>KAI Blog Engine</h1>
      <ButtonGroup className="Buttons">
        <Button className="b1" onClick={() => setCategory("java")}>
          Java
        </Button>
        <Button className="b2" onClick={() => setCategory("python")}>
          python
        </Button>
        <Button className="b3" onClick={() => setCategory("C/C++")}>
          C/C++
        </Button>
        <Button className="b1" onClick={() => setCategory("basic")}>
          Basic
        </Button>
        <Button className="b4" onClick={() => setCategory("")}>
          All
        </Button>
      </ButtonGroup>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      {!BegginingReached && <Button onClick={showPrevPage}>prev</Button>}
      {!reachedEnd && <Button onClick={showNextPage}>next</Button>}
      <hr />
    </Container>
  );
}

function CodeBlock({ value, language }) {
  return <SyntaxHighlighter language={language}>{value}</SyntaxHighlighter>;
}

function Post({ post }) {
  const { title, text, date, category } = post.data();

  return (
    <Card className="mb-5">
      <Card.Header className="font-weight-bold">
        {category && <>[{category}]</>} {title}
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <ReactMarkdown source={text} renderers={{ code: CodeBlock }} />
        </Card.Text>
        <Card.Text>
          <a rel="noopener noreferrer" href="https://repl.it/" target="_blank">
            Test the codes out
          </a>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-right" style={{ fontSize: "0.8em" }}>
        {new Date(date.toDate()).toDateString()}
      </Card.Footer>
    </Card>
  );
}
