const Header = ({ title }: { title: string }) => (
    <div className="w-full bg-[#212121] p-4">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold text-white text-left">{title}</h1>
      </div>
    </div>
  );
  
  export default Header;
  