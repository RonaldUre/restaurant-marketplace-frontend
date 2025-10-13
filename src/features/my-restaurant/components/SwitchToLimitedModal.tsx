import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseModal } from "@/components/shared/BaseModal";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type InventoryAdminItem } from "../services/inventoryAdminService";
import { switchToLimitedSchema, type SwitchToLimitedInput } from "../schemas/inventorySchema";
import { useEffect } from "react";

// La prop 'onSubmit' sigue esperando el tipo de dato final con NÚMEROS
interface Props {
  item: InventoryAdminItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { initialAvailable: number }) => void;
}

export function SwitchToLimitedModal({ item, isOpen, onClose, onSubmit }: Props) {
  // El formulario trabaja internamente con STRINGS
  const form = useForm<SwitchToLimitedInput>({
    resolver: zodResolver(switchToLimitedSchema),
    defaultValues: { initialAvailable: "0" },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset({ initialAvailable: "0" });
    }
  }, [isOpen, form]);

  // Esta función sirve de puente: recibe los strings del formulario,
  // los convierte a números y llama a la prop del padre con los datos correctos.
  const handleFormSubmit = (values: SwitchToLimitedInput) => {
    const outputValues = {
      initialAvailable: Number(values.initialAvailable),
    };
    onSubmit(outputValues);
  };
  
  if (!item) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pasar a Stock Limitado: ${item.name}`}
      description="Define la cantidad inicial de stock disponible para este producto."
    >
      <Form {...form}>
        {/* Usamos nuestra función intermediaria en el handleSubmit */}
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>Stock Inicial Disponible</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...form.register("initialAvailable")}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.initialAvailable?.message}</FormMessage>
          </FormItem>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Guardando..." : "Confirmar"}
            </Button>
          </div>
        </form>
      </Form>
    </BaseModal>
  );
}

