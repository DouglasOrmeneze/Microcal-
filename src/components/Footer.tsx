export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full max-w-6xl mx-auto mt-12 mb-10 px-4 pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest" id="app-footer">
      <div>
        Criado por: <span className="text-teal-500 font-extrabold">Oz Hidrogênio</span> &copy; {currentYear}
      </div>
      <div className="sm:text-right">
        Desenvolvedor: <span className="text-indigo-400 font-extrabold">Douglas Ormeneze</span>
      </div>
    </footer>
  );
}
