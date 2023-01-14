import Swal from "sweetalert2";

export const showConfirm = (
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  action,
  data = [],
  icon = "warning",
  confirmButtonText = "Yes, delete it!",
  cancelButtonText= 'No, cancel!'
) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      action(data);
    }
  });
};
