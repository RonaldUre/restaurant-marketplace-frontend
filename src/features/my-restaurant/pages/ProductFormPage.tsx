/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/my-restaurant/pages/ProductFormPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

import {
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "../schemas/productSchema";
import { ProductFormFields } from "../components/ProductFormFields";

import {
  createAdminProduct,
  updateAdminProduct,
  getAdminProduct,
  type ProductAdminDetail,
  type CreateProductPayload,
  type UpdateProductPayload,
} from "../services/productAdminService";

// Tipos (RHF v7.49+): distingue INPUT (lo que teclean) vs OUTPUT (tras resolver)
type CreateIn  = z.input<typeof createProductSchema>;   // priceAmount: string
type CreateOut = z.output<typeof createProductSchema>;  // priceAmount: number
type UpdateIn  = z.input<typeof updateProductSchema>;
type UpdateOut = z.output<typeof updateProductSchema>;

type FormIn  = CreateIn | UpdateIn;
type FormOut = CreateOut | UpdateOut;

export default function ProductFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(isEdit);
  const [initialName, setInitialName] = useState<string>("");

  // Resolver tipado para input (FormIn) y output (FormOut)
  const resolver = useMemo(
    () =>
      zodResolver(isEdit ? updateProductSchema : createProductSchema) as Resolver<
        FormIn,
        any,
        FormOut
      >,
    [isEdit]
  );

  // Valores por defecto en CREATE (input crudo: strings)
  const defaultCreateValues: CreateIn = useMemo(
    () => ({
      sku: "",
      name: "",
      description: "",
      category: "",
      priceAmount: "", // string (schema lo transformará a number)
      priceCurrency: "USD",
    }),
    []
  );

  // useForm con 3 genéricos: <Input, Context, Output>
  const form = useForm<FormIn, any, FormOut>({
    resolver,
    defaultValues: isEdit ? undefined : (defaultCreateValues as FormIn),
    mode: "onChange",
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (!isEdit || !id) return;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      toast.error("ID de producto inválido.");
      navigate(-1);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getAdminProduct(numericId);
        const p: ProductAdminDetail = res.data;

        // Adaptar al INPUT (strings) para el form
        const editDefaults: UpdateIn = {
          name: p.name ?? "",
          description: p.description ?? "",
          category: p.category ?? "",
          priceAmount: String(p.priceAmount ?? ""),
          priceCurrency: (p.priceCurrency ?? "USD").toUpperCase(),
        };

        if (mounted) {
          setInitialName(p.name ?? "");
          form.reset(editDefaults);
        }
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar el producto.");
        navigate(-1);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isEdit, id, form, navigate]);

  // Envío: recibe el OUTPUT del resolver (priceAmount ya es number)
  const onSubmit: SubmitHandler<FormOut> = async (values) => {
    try {
      if (isEdit && id) {
        const payload = values as UpdateOut as UpdateProductPayload;
        const res = await updateAdminProduct(Number(id), payload);
        toast.success(`Producto "${res.data.name}" actualizado.`);
      } else {
        const payload = values as CreateOut as CreateProductPayload; // incluye sku
        const res = await createAdminProduct(payload);
        toast.success(`Producto "${res.data.name}" creado.`);
      }
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      // Si usas axios, puedes leer err.response?.data?.code
      const code = err?.code ?? err?.response?.data?.code;
      const message =
        code === "CATALOG_SKU_ALREADY_IN_USE"
          ? "Ese SKU ya está en uso."
          : err?.response?.data?.message || "No se pudo guardar el producto.";
      toast.error(message);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-28 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const mode: "create" | "edit" = isEdit ? "edit" : "create";

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-1">
          <CardTitle>{mode === "create" ? "Crear Producto" : "Editar Producto"}</CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Completa los campos para añadir un nuevo producto a tu catálogo."
              : `Actualiza la información del producto${initialName ? ` "${initialName}"` : ""}.`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* ProductFormFields trabaja con el CONTROL del formulario.
                 RHF almacena INPUT (strings), el resolver convierte a OUTPUT (numbers).
                 El cast mantiene simple el consumo del componente compartido. */}
              <ProductFormFields
                control={form.control as unknown as import("react-hook-form").Control<CreateProductInput | UpdateProductInput>}
                mode={mode}
              />

              <div className="flex items-center gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
