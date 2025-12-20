import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Plus } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table"
import { StudentActions } from "@/components/student-actions"
import { StudentDialog } from "@/components/student-dialog"
import type { Student } from "@/hooks/use-students"

// Sample data for development (will be replaced with real API data)
const sampleStudents: Student[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", grade: "10", class: "A" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", grade: "11", class: "B" },
  { id: 3, name: "Carla Ruiz", email: "carla@example.com", grade: "12", class: "A" },
  { id: 4, name: "Daniel Lee", email: "daniel@example.com", grade: "9", class: "C" },
  { id: 5, name: "Emma Wilson", email: "emma@example.com", grade: "10", class: "B" },
  { id: 6, name: "Frank Martinez", email: "frank@example.com", grade: "11", class: "A" },
  { id: 7, name: "Grace Chen", email: "grace@example.com", grade: "12", class: "C" },
  { id: 8, name: "Henry Brown", email: "henry@example.com", grade: "9", class: "A" },
  { id: 9, name: "Ivy Davis", email: "ivy@example.com", grade: "10", class: "B" },
  { id: 10, name: "Jack Taylor", email: "jack@example.com", grade: "11", class: "C" },
]

export function StudentsTable() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  
  // Uncomment when API is ready
  // const { data: students, isLoading, error } = useStudents()
  
  // Using sample data for now
  const students = sampleStudents
  const isLoading = false

  const handleView = (student: Student) => {
    console.log("View student:", student)
    // Implement view logic
  }

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setDialogOpen(true)
  }

  const handleDelete = (student: Student) => {
    console.log("Delete student:", student)
    // Implement delete logic
  }

  const handleSave = (studentData: Partial<Student>) => {
    console.log("Save student:", studentData)
    // Implement save logic (create or update)
  }

  const handleAddNew = () => {
    setSelectedStudent(null)
    setDialogOpen(true)
  }

  const columns: ColumnDef<Student>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "grade",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Grade
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const grade = row.getValue("grade") as string
        return (
          <Badge variant="secondary" className="font-normal">
            Grade {grade}
          </Badge>
        )
      },
    },
    {
      accessorKey: "class",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Class
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const classValue = row.getValue("class") as string
        return <Badge variant="outline">Class {classValue}</Badge>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const student = row.original
        return (
          <StudentActions
            student={student}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )
      },
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading students...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage and view all student records
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={students || []} 
        searchKey="name"
        searchPlaceholder="Search students by name..."
      />

      <StudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={selectedStudent}
        onSave={handleSave}
      />
    </div>
  )
}
