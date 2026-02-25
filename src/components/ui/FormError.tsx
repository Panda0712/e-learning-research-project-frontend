const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <p className="mt-1 text-[12px] text-red-500 font-poppins">{message}</p>
  );
};

export default FormError;
