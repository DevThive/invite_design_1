import Base from "@layouts/Baseof";
import Posts from "@layouts/partials/Posts";
import { getSinglePage } from "@lib/contentParser";
import { slugify } from "@lib/utils/textConverter";
import { useSearchContext } from "context/state";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SearchPage = ({ authors }) => {
  const router = useRouter();
  const { query } = router;
  const keyword = slugify(query.key || ""); // 기본값 처리
  const { posts } = useSearchContext();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const controller = new AbortController(); // AbortController 생성
    const fetchData = () => {
      const results = posts.filter((post) => {
        const { draft, title, categories, tags, content } = post.frontmatter;
        if (draft) return false;

        return (
          slugify(title).includes(keyword) ||
          categories.some((category) => slugify(category).includes(keyword)) ||
          tags.some((tag) => slugify(tag).includes(keyword)) ||
          slugify(content).includes(keyword)
        );
      });

      setSearchResults(results);
    };

    fetchData();

    return () => {
      controller.abort(); // 컴포넌트 언마운트 시 요청 취소
    };
  }, [posts, keyword]); // posts와 keyword가 변경될 때마다 실행

  return (
    <Base title={`Search results for ${query.key}`}>
      <div className="section">
        <div className="container">
          <h1 className="h2 mb-8 text-center">
            Search results for <span className="text-primary">{query.key}</span>
          </h1>
          {searchResults.length > 0 ? (
            <Posts posts={searchResults} authors={authors} />
          ) : (
            <div className="py-24 text-center text-h3 shadow">
              No Search Found
            </div>
          )}
        </div>
      </div>
    </Base>
  );
};

export default SearchPage;

// get authors data
export const getStaticProps = () => {
  const authors = getSinglePage("content/authors");
  return {
    props: {
      authors,
    },
  };
};
