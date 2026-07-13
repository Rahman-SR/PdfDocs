export function WorkspaceFooter() {
  return (
    <footer className="border-t border-line bg-[#f3f4f5] px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display font-semibold">PDF Toolkit</p>
          <p className="mt-3 max-w-xs leading-6 text-muted">Advanced document processing for focused, privacy-conscious workflows.</p>
        </div>
        <div><p className="font-display text-xs font-semibold uppercase tracking-wider">Company</p><p className="mt-3 leading-7 text-muted">Privacy Policy<br />Terms of Service</p></div>
        <div><p className="font-display text-xs font-semibold uppercase tracking-wider">Resources</p><p className="mt-3 leading-7 text-muted">Security<br />Status</p></div>
        <p className="text-xs leading-5 text-muted lg:text-right">© {new Date().getFullYear()} PDF Toolkit.<br />Securely processing files globally.</p>
      </div>
    </footer>
  )
}
