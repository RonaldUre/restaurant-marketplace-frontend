import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseModal } from "@/components/shared/BaseModal";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { type InventoryAdminItem } from "../services/inventoryAdminService";
import { adjustStockSchema, type AdjustStockInput } from "../schemas/inventorySchema";
import { useEffect } from "react";

// La prop 'onSubmit' sigue esperando el tipo de dato final con NÚMEROS
interface Props {
  item: InventoryAdminItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { delta: number; reason?: string }) => void;
}

export function AdjustStockModal({ item, isOpen, onClose, onSubmit }: Props) {
  // El formulario trabaja internamente con STRINGS
  const form = useForm<AdjustStockInput>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: { delta: "", reason: "" },
  });
  
  useEffect(() => {
    if (!isOpen) {
      form.reset({ delta: "", reason: "" });
    }
  }, [isOpen, form]);

  // Esta función sirve de puente: recibe los strings del formulario,
  // los convierte a números y llama a la prop del padre con los datos correctos.
  const handleFormSubmit = (values: AdjustStockInput) => {
    const outputValues = {
      ...values,
      delta: Number(values.delta),
    };
    onSubmit(outputValues);
  };

  if (!item) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ajustar Stock de: ${item.name}`}
      description="Ingresa un número positivo para añadir stock o negativo para quitar."
    >
      <Form {...form}>
        {/* Usamos nuestra función intermediaria en el handleSubmit */}
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>Cantidad a ajustar (Delta)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Ej: -5 o 10"
                {...form.register("delta")}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.delta?.message}</FormMessage>
          </FormItem>
          
          <FormItem>
            <FormLabel>Razón (Opcional)</FormLabel>
            <FormControl>
              <Textarea {...form.register("reason")} />
            </FormControl>
             <FormMessage>{form.formState.errors.reason?.message}</FormMessage>
          </FormItem>

          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Guardando..." : "Confirmar Ajuste"}
            </Button>
          </div>
        </form>
      </Form>
    </BaseModal>
  );
}
