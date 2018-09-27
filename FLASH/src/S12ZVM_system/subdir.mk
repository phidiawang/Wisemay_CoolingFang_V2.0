################################################################################
# Automatically-generated file. Do not edit!
################################################################################

-include ../../makefile.local

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS_QUOTED += \
"../src/S12ZVM_system/vector.c" \

C_SRCS += \
../src/S12ZVM_system/vector.c \

OBJS += \
./src/S12ZVM_system/vector_c.obj \

OBJS_QUOTED += \
"./src/S12ZVM_system/vector_c.obj" \

C_DEPS += \
./src/S12ZVM_system/vector_c.d \

C_DEPS_QUOTED += \
"./src/S12ZVM_system/vector_c.d" \

OBJS_OS_FORMAT += \
./src/S12ZVM_system/vector_c.obj \


# Each subdirectory must supply rules for building sources it contributes
src/S12ZVM_system/vector_c.obj: ../src/S12ZVM_system/vector.c
	@echo 'Building file: $<'
	@echo 'Executing target #5 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/S12ZVM_system/vector.args" -o "src/S12ZVM_system/vector_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/S12ZVM_system/%.d: ../src/S12ZVM_system/%.c
	@echo 'Regenerating dependency file: $@'
	
	@echo ' '


