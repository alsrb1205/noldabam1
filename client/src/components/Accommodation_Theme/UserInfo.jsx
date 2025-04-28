import FormContents from "./FormContents.jsx";
export default function UserInfo() {

  return (
    <>
      <div className="hidden md:block">
        <div className="sticky top-[140px] p-4 space-y-4 hidden md:block shadow rounded-xl h-fit border">
          <FormContents />
        </div>
      </div>
    </>
  );
}
