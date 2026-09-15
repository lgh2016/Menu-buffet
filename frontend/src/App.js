import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import MenuPage from "@/pages/MenuPage";
import AdminBuffets from "@/pages/admin/AdminBuffets";
import AdminBuffetEditor from "@/pages/admin/AdminBuffetEditor";
import AdminDrinks from "@/pages/admin/AdminDrinks";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/admin/buffets" element={<AdminBuffets />} />
        <Route path="/admin/buffets/:id" element={<AdminBuffetEditor />} />
        <Route path="/admin/bebidas" element={<AdminDrinks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
