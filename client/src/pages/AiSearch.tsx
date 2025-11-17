import React from "react";
import { TextBox, InputSuffix } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Card, CardHeader, CardTitle, CardBody } from "@progress/kendo-react-layout";
import { searchIcon } from "@progress/kendo-svg-icons";

export default function AiSearch() {
  return (
    <div style={{ minHeight: 'calc(100vh - 53px)', background: 'linear-gradient(135deg, #1F7ACF 20%, #2E7BD2 50%, #2BBACD 85%)', padding: '20px'}}>
      <div className="k-d-flex k-flex-column k-gap-2 k-justify-content-center k-align-items-center k-mb-8">
        <h1 className="k-h1" style={{ margin: '0', color: 'white' }}>AI Search Page</h1>
        <p style={{ color: 'white' }}>This is the AI Search page content.</p>
      </div>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <TextBox
          size="large"
          placeholder="Type your AI search query here..."
          suffix={() => (
            <InputSuffix>
              <Button size="large" fillMode="flat" svgIcon={searchIcon} />
            </InputSuffix>
          )}
        />
      </div>
      <div className="k-d-flex k-flex-column k-gap-2 k-justify-content-center k-align-items-center k-mt-8">
        <p style={{ color: 'white' }}>Popular searches:</p>
        <div className="k-d-grid k-grid-cols-3 k-gap-3">
          <Button>Example Search</Button>
          <Button>Example Search</Button>
          <Button>Example Search</Button>
          <Button>Example Search</Button>
          <Button>Example Search</Button>
        </div>
      </div>
      <div style={{maxWidth: '600px'}} className="k-mt-20 k-mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>AI Search Results</CardTitle>
          </CardHeader>
          <CardBody>
            <p>Your AI search results will appear here.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero ex quos fuga similique nostrum unde, ratione deserunt sit nam necessitatibus doloremque nemo tempora aperiam beatae rem saepe eius quia nihil.
            Iusto at eos vitae explicabo molestiae sint, esse harum ea, ipsam praesentium saepe a! Nemo, obcaecati pariatur. Cupiditate, ullam quisquam voluptatum repellat magnam inventore placeat aliquam, delectus dolorum ratione harum.
            Facere corrupti odio pariatur eum, sequi quae modi a consectetur, aliquid facilis adipisci repellat cum rem odit dolore, deleniti iusto dignissimos maxime dolorum laborum commodi nam sunt! Cum, ut sint?
            Officia voluptatem reiciendis at, in nisi, quidem aspernatur alias error est corporis, omnis natus! Ad velit illum eum commodi, enim recusandae laboriosam delectus ratione! Ut ullam vitae quis ipsam corrupti!
            Itaque accusantium nihil quaerat omnis reprehenderit eveniet fuga repudiandae aliquam delectus, molestias veritatis adipisci, non expedita placeat commodi ea? Facere esse est quis fugiat tenetur quibusdam repellendus et delectus corrupti!
            Exercitationem molestias consequatur distinctio a, hic cum nisi, enim delectus dolores laudantium in vero soluta ratione dolorem maiores repudiandae expedita error! Pariatur, nam aliquid? Inventore nostrum laboriosam quo asperiores mollitia.
            Error laudantium in autem tempora soluta odit hic quasi totam ipsam! Repellat voluptate inventore illo saepe reiciendis accusamus quaerat voluptatem, aliquam sint molestias illum laborum adipisci optio a placeat ipsum!
            Consectetur facilis dolor aspernatur alias eius, odit quia fugiat ipsa fugit magni dolore perferendis? Repudiandae enim quis deserunt temporibus facilis explicabo veritatis a expedita autem ullam, ab voluptates impedit ipsum.</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}