import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"

type Student = {
  id: string
  name: string
  email: string
  grade: string
  status: "Active" | "Inactive"
}

const sampleStudents: Student[] = [
  { id: "S-001", name: "Alice Johnson", email: "alice@example.com", grade: "10", status: "Active" },
  { id: "S-002", name: "Bob Smith", email: "bob@example.com", grade: "11", status: "Active" },
  { id: "S-003", name: "Carla Ruiz", email: "carla@example.com", grade: "12", status: "Inactive" },
  { id: "S-004", name: "Daniel Lee", email: "daniel@example.com", grade: "9", status: "Active" },
]

export function StudentsTable() {
  return (
    <div className="w-full">
      <Table>
        <TableCaption>List of registered students</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.id}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell className="text-muted-foreground">{student.email}</TableCell>
              <TableCell>{student.grade}</TableCell>
              <TableCell className="text-right">
                <span
                  className={
                    student.status === "Active"
                      ? "inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                      : "inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-400"
                  }
                >
                  {student.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


